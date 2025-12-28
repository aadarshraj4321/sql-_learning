const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  sampleTables: [{
    tableName: {
      type: String,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    sampleData: {
      type: Array,
      required: true
    }
  }],
  hints: [{
    level: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);