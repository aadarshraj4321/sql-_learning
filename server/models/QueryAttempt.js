const mongoose = require('mongoose');

const queryAttemptSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  userId: {
    type: String,
    required: false // Optional for anonymous users
  },
  query: {
    type: String,
    required: true
  },
  isSuccessful: {
    type: Boolean,
    required: true
  },
  executionTime: {
    type: Number, // in milliseconds
    required: true
  },
  errorMessage: {
    type: String,
    required: false
  },
  resultRows: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QueryAttempt', queryAttemptSchema);