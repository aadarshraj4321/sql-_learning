const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for standalone operation
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
  },
  {
    _id: '64f8a1b2c3d4e5f6a7b8c9d2',
    title: 'Aggregate Functions',
    description: 'Use aggregate functions to calculate summary statistics',
    difficulty: 'Advanced',
    tags: ['GROUP BY', 'AVG', 'ORDER BY', 'JOIN'],
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
  },
  '64f8a1b2c3d4e5f6a7b8c9d1': {
    _id: '64f8a1b2c3d4e5f6a7b8c9d1',
    title: 'JOIN Operations',
    description: 'Practice joining multiple tables to retrieve related data',
    question: 'Write a query to show employee names along with their department names. Use the employees and departments tables.',
    difficulty: 'Intermediate',
    expectedOutput: 'Employee names with their corresponding department names',
    sampleTables: [
      {
        tableName: 'employees',
        schema: {
          id: 'INTEGER PRIMARY KEY',
          name: 'VARCHAR(100)',
          department_id: 'INTEGER',
          salary: 'INTEGER'
        },
        sampleData: [
          { id: 1, name: 'John Doe', department_id: 1, salary: 75000 },
          { id: 2, name: 'Jane Smith', department_id: 2, salary: 45000 },
          { id: 3, name: 'Bob Johnson', department_id: 1, salary: 80000 }
        ]
      },
      {
        tableName: 'departments',
        schema: {
          id: 'INTEGER PRIMARY KEY',
          name: 'VARCHAR(100)',
          manager_id: 'INTEGER'
        },
        sampleData: [
          { id: 1, name: 'Engineering', manager_id: 1 },
          { id: 2, name: 'Marketing', manager_id: 2 },
          { id: 3, name: 'HR', manager_id: 4 }
        ]
      }
    ],
    tags: ['JOIN', 'INNER JOIN', 'relationships'],
    createdAt: new Date().toISOString(),
    isActive: true
  },
  '64f8a1b2c3d4e5f6a7b8c9d2': {
    _id: '64f8a1b2c3d4e5f6a7b8c9d2',
    title: 'Aggregate Functions',
    description: 'Use aggregate functions to calculate summary statistics',
    question: 'Find the average salary for each department. Show department name and average salary, ordered by average salary descending.',
    difficulty: 'Advanced',
    expectedOutput: 'Department names with their average salaries in descending order',
    sampleTables: [
      {
        tableName: 'employees',
        schema: {
          id: 'INTEGER PRIMARY KEY',
          name: 'VARCHAR(100)',
          department_id: 'INTEGER',
          salary: 'INTEGER'
        },
        sampleData: [
          { id: 1, name: 'John Doe', department_id: 1, salary: 75000 },
          { id: 2, name: 'Jane Smith', department_id: 2, salary: 45000 },
          { id: 3, name: 'Bob Johnson', department_id: 1, salary: 80000 },
          { id: 4, name: 'Alice Brown', department_id: 3, salary: 55000 },
          { id: 5, name: 'Charlie Wilson', department_id: 2, salary: 50000 }
        ]
      },
      {
        tableName: 'departments',
        schema: {
          id: 'INTEGER PRIMARY KEY',
          name: 'VARCHAR(100)'
        },
        sampleData: [
          { id: 1, name: 'Engineering' },
          { id: 2, name: 'Marketing' },
          { id: 3, name: 'HR' }
        ]
      }
    ],
    tags: ['GROUP BY', 'AVG', 'ORDER BY', 'JOIN'],
    createdAt: new Date().toISOString(),
    isActive: true
  }
};

// Query validation functions
function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Query must be a non-empty string' };
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return { isValid: false, error: 'Query cannot be empty' };
  }

  // Check for dangerous keywords
  const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 'TRUNCATE'];
  const upperQuery = trimmedQuery.toUpperCase();
  
  for (const keyword of dangerousKeywords) {
    if (upperQuery.includes(keyword)) {
      return { isValid: false, error: `Dangerous operation detected: ${keyword}. Only SELECT queries are allowed.` };
    }
  }

  if (!upperQuery.trim().startsWith('SELECT')) {
    return { isValid: false, error: 'Only SELECT queries are allowed' };
  }

  return { isValid: true, error: null };
}

function generateMockResults(query, assignmentId) {
  const assignment = mockAssignmentDetails[assignmentId];
  if (!assignment) {
    return {
      columns: [{ name: 'error', type: 1043 }],
      rows: [{ error: 'Assignment not found' }],
      rowCount: 1,
      executionTime: 10
    };
  }

  // Simple mock results based on query content
  if (query.toLowerCase().includes('where salary > 50000')) {
    return {
      columns: [
        { name: 'id', type: 23 },
        { name: 'name', type: 1043 },
        { name: 'department', type: 1043 },
        { name: 'salary', type: 23 },
        { name: 'hire_date', type: 1082 }
      ],
      rows: [
        { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2022-01-15' },
        { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2021-11-10' },
        { id: 4, name: 'Alice Brown', department: 'HR', salary: 55000, hire_date: '2023-02-01' }
      ],
      rowCount: 3,
      executionTime: Math.floor(Math.random() * 100) + 20
    };
  }

  if (query.toLowerCase().includes('join')) {
    return {
      columns: [
        { name: 'name', type: 1043 },
        { name: 'department_name', type: 1043 }
      ],
      rows: [
        { name: 'John Doe', department_name: 'Engineering' },
        { name: 'Jane Smith', department_name: 'Marketing' },
        { name: 'Bob Johnson', department_name: 'Engineering' }
      ],
      rowCount: 3,
      executionTime: Math.floor(Math.random() * 100) + 30
    };
  }

  if (query.toLowerCase().includes('avg') && query.toLowerCase().includes('group by')) {
    return {
      columns: [
        { name: 'name', type: 1043 },
        { name: 'avg_salary', type: 1700 }
      ],
      rows: [
        { name: 'Engineering', avg_salary: 77500.00 },
        { name: 'HR', avg_salary: 55000.00 },
        { name: 'Marketing', avg_salary: 47500.00 }
      ],
      rowCount: 3,
      executionTime: Math.floor(Math.random() * 100) + 40
    };
  }

  // Default result for basic SELECT
  const table = assignment.sampleTables[0];
  return {
    columns: Object.keys(table.schema).map(col => ({ name: col, type: 1043 })),
    rows: table.sampleData,
    rowCount: table.sampleData.length,
    executionTime: Math.floor(Math.random() * 50) + 10
  };
}

// Routes
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
  const { query, assignmentId } = req.body;
  
  if (!query || !assignmentId) {
    return res.status(400).json({
      success: false,
      error: 'Query and assignment ID are required'
    });
  }

  const validation = validateQuery(query);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: validation.error
    });
  }

  const results = generateMockResults(query, assignmentId);
  
  res.json({
    success: true,
    data: results
  });
});

app.post('/api/hints/generate', (req, res) => {
  const { assignmentId, userQuery, errorMessage } = req.body;
  
  if (!assignmentId) {
    return res.status(400).json({
      success: false,
      error: 'Assignment ID is required'
    });
  }

  const assignment = mockAssignmentDetails[assignmentId];
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  // Generate contextual hints based on assignment difficulty and user input
  let hint = '';
  
  if (errorMessage) {
    if (errorMessage.includes('syntax error')) {
      hint = "Check your SQL syntax. Make sure you have proper commas, parentheses, and keywords spelled correctly.";
    } else if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
      hint = "It looks like you're referencing a column that doesn't exist. Double-check the column names in the table schema.";
    } else {
      hint = "There's an error in your query. Review the error message and check your SQL syntax.";
    }
  } else {
    switch (assignment.difficulty) {
      case 'Beginner':
        if (userQuery && userQuery.toLowerCase().includes('select')) {
          hint = "Good start with SELECT! Now think about which specific columns you need and whether you need to filter the results with a WHERE clause.";
        } else {
          hint = "Start with a basic SELECT statement. Think about which columns you need and which table contains the data.";
        }
        break;
      case 'Intermediate':
        if (userQuery && userQuery.toLowerCase().includes('join')) {
          hint = "You're on the right track with JOIN! Make sure you're connecting the tables using the correct foreign key relationships.";
        } else {
          hint = "This problem requires joining tables. Look at the table schemas to identify the foreign key relationships between tables.";
        }
        break;
      case 'Advanced':
        if (userQuery && userQuery.toLowerCase().includes('group by')) {
          hint = "Great! You're using GROUP BY. Don't forget to use aggregate functions like AVG() and consider the ORDER BY clause for sorting.";
        } else {
          hint = "This problem involves grouping data and calculating aggregates. Think about which columns to group by and what aggregate functions you need.";
        }
        break;
      default:
        hint = "Read the question carefully and identify what data you need to retrieve. Start with the basic structure and build from there.";
    }
  }

  res.json({
    success: true,
    data: {
      hint,
      timestamp: new Date().toISOString(),
      fallback: false
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 CipherSQLStudio Server running on port ${PORT}`);
  console.log(`📊 Mock data loaded - ready for testing!`);
  console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:3001`);
});