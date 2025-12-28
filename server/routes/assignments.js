const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const router = express.Router();

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .select('title description difficulty tags createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment || !assignment.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
});

// Create new assignment (admin only - for seeding data)
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('question').trim().isLength({ min: 1 }).withMessage('Question is required'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('expectedOutput').trim().isLength({ min: 1 }).withMessage('Expected output is required'),
  body('sampleTables').isArray({ min: 1 }).withMessage('At least one sample table is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const assignment = new Assignment(req.body);
    await assignment.save();

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment'
    });
  }
});

module.exports = router;