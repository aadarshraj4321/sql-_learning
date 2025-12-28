const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const pool = require('../config/postgres');
const QueryAttempt = require('../models/QueryAttempt');
const { sanitizeQuery, validateQuery } = require('../utils/queryValidator');
const router = express.Router();

// Execute SQL query
router.post('/execute', [
  body('query').trim().isLength({ min: 1 }).withMessage('Query is required'),
  body('assignmentId').isMongoId().withMessage('Valid assignment ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { query, assignmentId, userId } = req.body;
    const startTime = Date.now();

    // Validate and sanitize the query
    const validationResult = validateQuery(query);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: validationResult.error
      });
    }

    const sanitizedQuery = sanitizeQuery(query);

    let result;
    let isSuccessful = false;
    let errorMessage = null;
    let resultRows = 0;

    try {
      // Execute the query with a timeout
      const client = await pool.connect();
      try {
        // Set a statement timeout
        await client.query('SET statement_timeout = 30000'); // 30 seconds
        
        result = await client.query(sanitizedQuery);
        isSuccessful = true;
        resultRows = result.rows.length;
      } finally {
        client.release();
      }
    } catch (dbError) {
      console.error('Database query error:', dbError);
      errorMessage = dbError.message;
      isSuccessful = false;
    }

    const executionTime = Date.now() - startTime;

    // Log the query attempt
    try {
      const queryAttempt = new QueryAttempt({
        assignmentId,
        userId: userId || null,
        query: sanitizedQuery,
        isSuccessful,
        executionTime,
        errorMessage,
        resultRows
      });
      await queryAttempt.save();
    } catch (logError) {
      console.error('Error logging query attempt:', logError);
      // Don't fail the request if logging fails
    }

    if (isSuccessful) {
      res.json({
        success: true,
        data: {
          columns: result.fields.map(field => ({
            name: field.name,
            type: field.dataTypeID
          })),
          rows: result.rows,
          rowCount: result.rowCount,
          executionTime
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: errorMessage,
        executionTime
      });
    }

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute query'
    });
  }
});

// Get query statistics for an assignment
router.get('/stats/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const stats = await QueryAttempt.aggregate([
      { $match: { assignmentId: mongoose.Types.ObjectId(assignmentId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          successfulAttempts: {
            $sum: { $cond: ['$isSuccessful', 1, 0] }
          },
          averageExecutionTime: { $avg: '$executionTime' },
          totalHintsUsed: { $sum: '$hintsUsed' }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalAttempts: 0,
        successfulAttempts: 0,
        averageExecutionTime: 0,
        totalHintsUsed: 0
      }
    });
  } catch (error) {
    console.error('Error fetching query stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch query statistics'
    });
  }
});

module.exports = router;