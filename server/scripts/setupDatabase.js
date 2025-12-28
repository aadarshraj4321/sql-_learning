const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const Assignment = require('../models/Assignment');

// PostgreSQL connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Sample assignments data
const sampleAssignments = [
  {
    title: "Basic SELECT Query",
    description: "Learn to retrieve data from a single table using SELECT statement",
    question: "Write a query to select all columns from the 'employees' table where the salary is greater than 50000.",
    difficulty: "Beginner",
    expectedOutput: "All employee records with salary > 50000",
    sampleTables: [
      {
        tableName: "employees",
        schema: {
          id: "INTEGER PRIMARY KEY",
          name: "VARCHAR(100)",
          department: "VARCHAR(50)",
          salary: "INTEGER",
          hire_date: "DATE"
        },
        sampleData: [
          { id: 1, name: "John Doe", department: "Engineering", salary: 75000, hire_date: "2022-01-15" },
          { id: 2, name: "Jane Smith", department: "Marketing", salary: 45000, hire_date: "2022-03-20" },
          { id: 3, name: "Bob Johnson", department: "Engineering", salary: 80000, hire_date: "2021-11-10" },
          { id: 4, name: "Alice Brown", department: "HR", salary: 55000, hire_date: "2023-02-01" }
        ]
      }
    ],
    hints: [
      { level: 1, content: "Use the WHERE clause to filter records based on salary" },
      { level: 2, content: "Remember to use the > operator for 'greater than' comparisons" }
    ],
    tags: ["SELECT", "WHERE", "basic"]
  },
  {
    title: "JOIN Operations",
    description: "Practice joining multiple tables to retrieve related data",
    question: "Write a query to show employee names along with their department names. Use the employees and departments tables.",
    difficulty: "Intermediate",
    expectedOutput: "Employee names with their corresponding department names",
    sampleTables: [
      {
        tableName: "employees",
        schema: {
          id: "INTEGER PRIMARY KEY",
          name: "VARCHAR(100)",
          department_id: "INTEGER",
          salary: "INTEGER"
        },
        sampleData: [
          { id: 1, name: "John Doe", department_id: 1, salary: 75000 },
          { id: 2, name: "Jane Smith", department_id: 2, salary: 45000 },
          { id: 3, name: "Bob Johnson", department_id: 1, salary: 80000 }
        ]
      },
      {
        tableName: "departments",
        schema: {
          id: "INTEGER PRIMARY KEY",
          name: "VARCHAR(100)",
          manager_id: "INTEGER"
        },
        sampleData: [
          { id: 1, name: "Engineering", manager_id: 1 },
          { id: 2, name: "Marketing", manager_id: 2 },
          { id: 3, name: "HR", manager_id: 4 }
        ]
      }
    ],
    hints: [
      { level: 1, content: "You need to connect employees to departments using a foreign key relationship" },
      { level: 2, content: "Use INNER JOIN to combine data from both tables" },
      { level: 3, content: "The department_id in employees table should match the id in departments table" }
    ],
    tags: ["JOIN", "INNER JOIN", "relationships"]
  },
  {
    title: "Aggregate Functions",
    description: "Use aggregate functions to calculate summary statistics",
    question: "Find the average salary for each department. Show department name and average salary, ordered by average salary descending.",
    difficulty: "Intermediate",
    expectedOutput: "Department names with their average salaries in descending order",
    sampleTables: [
      {
        tableName: "employees",
        schema: {
          id: "INTEGER PRIMARY KEY",
          name: "VARCHAR(100)",
          department_id: "INTEGER",
          salary: "INTEGER"
        },
        sampleData: [
          { id: 1, name: "John Doe", department_id: 1, salary: 75000 },
          { id: 2, name: "Jane Smith", department_id: 2, salary: 45000 },
          { id: 3, name: "Bob Johnson", department_id: 1, salary: 80000 },
          { id: 4, name: "Alice Brown", department_id: 3, salary: 55000 },
          { id: 5, name: "Charlie Wilson", department_id: 2, salary: 50000 }
        ]
      },
      {
        tableName: "departments",
        schema: {
          id: "INTEGER PRIMARY KEY",
          name: "VARCHAR(100)"
        },
        sampleData: [
          { id: 1, name: "Engineering" },
          { id: 2, name: "Marketing" },
          { id: 3, name: "HR" }
        ]
      }
    ],
    hints: [
      { level: 1, content: "Use AVG() function to calculate average salary" },
      { level: 2, content: "GROUP BY department to get averages per department" },
      { level: 3, content: "JOIN with departments table to get department names" },
      { level: 4, content: "Use ORDER BY with DESC for descending order" }
    ],
    tags: ["GROUP BY", "AVG", "ORDER BY", "JOIN"]
  }
];

async function setupPostgreSQL() {
  console.log('Setting up PostgreSQL tables...');
  
  try {
    // Create employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(50),
        department_id INTEGER,
        salary INTEGER NOT NULL,
        hire_date DATE
      )
    `);

    // Create departments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        manager_id INTEGER
      )
    `);

    // Clear existing data
    await pool.query('DELETE FROM employees');
    await pool.query('DELETE FROM departments');

    // Insert sample data for departments
    await pool.query(`
      INSERT INTO departments (id, name, manager_id) VALUES
      (1, 'Engineering', 1),
      (2, 'Marketing', 2),
      (3, 'HR', 4)
    `);

    // Insert sample data for employees
    await pool.query(`
      INSERT INTO employees (id, name, department, department_id, salary, hire_date) VALUES
      (1, 'John Doe', 'Engineering', 1, 75000, '2022-01-15'),
      (2, 'Jane Smith', 'Marketing', 2, 45000, '2022-03-20'),
      (3, 'Bob Johnson', 'Engineering', 1, 80000, '2021-11-10'),
      (4, 'Alice Brown', 'HR', 3, 55000, '2023-02-01'),
      (5, 'Charlie Wilson', 'Marketing', 2, 50000, '2023-01-10')
    `);

    console.log('PostgreSQL setup completed successfully!');
  } catch (error) {
    console.error('Error setting up PostgreSQL:', error);
    throw error;
  }
}

async function setupMongoDB() {
  console.log('Setting up MongoDB data...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});

    // Insert sample assignments
    await Assignment.insertMany(sampleAssignments);

    console.log('MongoDB setup completed successfully!');
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting database setup...');
    
    await setupPostgreSQL();
    await setupMongoDB();
    
    console.log('Database setup completed successfully!');
    console.log('Sample assignments created:');
    sampleAssignments.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title} (${assignment.difficulty})`);
    });
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();