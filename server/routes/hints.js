const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const Assignment = require('../models/Assignment');
const QueryAttempt = require('../models/QueryAttempt');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get AI-powered hint for an assignment
router.post('/generate', [
  body('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
  body('userQuery').optional().trim(),
  body('errorMessage').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { assignmentId, userQuery, errorMessage, userId } = req.body;

    // Get the assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    // Get user's previous attempts for context
    const previousAttempts = await QueryAttempt.find({
      assignmentId,
      userId: userId || null
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('query isSuccessful errorMessage');

    // Construct the prompt for the LLM
    const prompt = buildHintPrompt(assignment, userQuery, errorMessage, previousAttempts);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful SQL tutor. Provide hints and guidance to help students learn SQL, but never give complete solutions. Focus on teaching concepts and pointing students in the right direction."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const hint = completion.choices[0].message.content.trim();

      // Update the query attempt with hint usage
      if (userId) {
        try {
          await QueryAttempt.updateMany(
            { assignmentId, userId },
            { $inc: { hintsUsed: 1 } }
          );
        } catch (updateError) {
          console.error('Error updating hint usage:', updateError);
        }
      }

      res.json({
        success: true,
        data: {
          hint,
          timestamp: new Date().toISOString()
        }
      });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to predefined hints if OpenAI fails
      const fallbackHint = getFallbackHint(assignment, userQuery, errorMessage);
      
      res.json({
        success: true,
        data: {
          hint: fallbackHint,
          timestamp: new Date().toISOString(),
          fallback: true
        }
      });
    }

  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint'
    });
  }
});

function buildHintPrompt(assignment, userQuery, errorMessage, previousAttempts) {
  let prompt = `Assignment: ${assignment.title}\n`;
  prompt += `Question: ${assignment.question}\n`;
  prompt += `Difficulty: ${assignment.difficulty}\n\n`;
  
  prompt += `Available tables:\n`;
  assignment.sampleTables.forEach(table => {
    prompt += `- ${table.tableName}: ${Object.keys(table.schema).join(', ')}\n`;
  });
  
  if (userQuery) {
    prompt += `\nStudent's current query:\n${userQuery}\n`;
  }
  
  if (errorMessage) {
    prompt += `\nError encountered:\n${errorMessage}\n`;
  }
  
  if (previousAttempts.length > 0) {
    prompt += `\nPrevious attempts:\n`;
    previousAttempts.forEach((attempt, index) => {
      prompt += `${index + 1}. ${attempt.query} (${attempt.isSuccessful ? 'Success' : 'Failed'})\n`;
    });
  }
  
  prompt += `\nPlease provide a helpful hint to guide the student toward the solution. Do not give the complete answer, but help them understand what they need to think about or what SQL concepts to apply. Keep it concise and educational.`;
  
  return prompt;
}

function getFallbackHint(assignment, userQuery, errorMessage) {
  // Simple fallback hints based on common patterns
  if (errorMessage) {
    if (errorMessage.includes('syntax error')) {
      return "Check your SQL syntax. Make sure you have proper commas, parentheses, and keywords spelled correctly.";
    }
    if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
      return "It looks like you're referencing a column that doesn't exist. Double-check the column names in the table schema.";
    }
    if (errorMessage.includes('table') && errorMessage.includes('does not exist')) {
      return "Make sure you're using the correct table name. Check the available tables in the sample data section.";
    }
  }
  
  // Generic hints based on difficulty
  switch (assignment.difficulty) {
    case 'Beginner':
      return "Start with a basic SELECT statement. Think about which columns you need and which table contains the data.";
    case 'Intermediate':
      return "This might require joining tables or using aggregate functions. Consider what relationships exist between the tables.";
    case 'Advanced':
      return "This problem likely involves complex queries with subqueries, window functions, or advanced joins. Break it down into smaller parts.";
    default:
      return "Read the question carefully and identify what data you need to retrieve. Start with the basic structure and build from there.";
  }
}

module.exports = router;