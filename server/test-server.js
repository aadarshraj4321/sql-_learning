const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Mock data for testing
const mockAssignments = [
  {
    _id: '64f8a1b2c3d4e5f6a7b8c9d0',
    title: 'Basic SELECT Query',
    description: 'Learn to retrieve data from a single table using SELECT statement',
    difficulty: 'Beginner',
    tags: ['SELECT', 'WHERE', 'basic'],
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '64f8a1b2c3d4e5f6a7b8c9d1',
    title: 'JOIN Operations',
    description: 'Practice joining multiple tables to retrieve related data',
    difficulty: 'Intermediate',
    tags: ['JOIN', 'INNER JOIN', 'relationships'],
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

const mockAssignmentDetails = {
  '64f8a1b2c3d4e5f6a7b8c9d0': {
    _id: '64f8a1b2c3d4e5f6a7b8c9d0',
    title: 'Basic SELECT Query',
    description: 'Learn to retrieve data from a single table using SELECT statement',
    question: 'Write a query to select all columns from the employees table where the salary is greater than 50000.',
    difficulty: 'Beginner',
    expectedOutput: 'All employee records with salary > 50000',
    sampleTables: [
      {
        tableName: 'employees',
        schema: {
          id: 'INTEGER PRIMARY KEY',
          name: 'VARCHAR(100)',
          department: 'VARCHAR(50)',
          salary: 'INTEGER',
          hire_date: 'DATE'
        },
        sampleData: [
          { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2022-01-15' },
          { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 45000, hire_date: '2022-03-20' },
          { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2021-11-10' },
          { id: 4, name: 'Alice Brown', department: 'HR', salary: 55000, hire_date: '2023-02-01' }
        ]
      }
    ],
    tags: ['SELECT', 'WHERE', 'basic'],
    createdAt: new Date().toISOString(),
    isActive: true
  }
};

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/assignments', (req, res) => {
  res.json({
    success: true,
    data: mockAssignments
  });
});

app.get('/api/assignments/:id', (req, res) => {
  const assignment = mockAssignmentDetails[req.params.id];
  if (assignment) {
    res.json({
      success: true,
      data: assignment
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }
});

app.post('/api/queries/execute', (req, res) => {
  const { query } = req.body;
  
  // Simple mock response for testing
  if (query && query.toLowerCase().includes('select')) {
    res.json({
      success: true,
      data: {
        columns: [
          { name: 'id', type: 23 },
          { name: 'name', type: 1043 },
          { name: 'salary', type: 23 }
        ],
        rows: [
          { id: 1, name: 'John Doe', salary: 75000 },
          { id: 3, name: 'Bob Johnson', salary: 80000 },
          { id: 4, name: 'Alice Brown', salary: 55000 }
        ],
        rowCount: 3,
        executionTime: 45
      }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Only SELECT queries are allowed'
    });
  }
});

app.post('/api/hints/generate', (req, res) => {
  res.json({
    success: true,
    data: {
      hint: "Start with a basic SELECT statement. Think about which columns you need and use the WHERE clause to filter records based on salary.",
      timestamp: new Date().toISOString(),
      fallback: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Mock data loaded - ready for testing!`);
});