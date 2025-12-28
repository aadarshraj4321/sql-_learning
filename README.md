<<<<<<< HEAD
CipherSQLStudio - SQL Learning Platform

CipherSQLStudio is a browser-based SQL learning platform designed to help students practice SQL queries. With real-time execution, intelligent hints, and a structured difficulty progression, it provides an interactive and safe learning environment for mastering SQL.

🎯 Project Overview

CipherSQLStudio offers a comprehensive platform for learning and practicing SQL. Key features include:

Practice SQL Queries: Execute queries against realistic datasets.

Get Intelligent Hints: Receive contextual, AI-powered hints (without full solutions).

See Real-Time Results: View formatted output with execution metrics.

Progress Through Levels: Difficulty levels ranging from beginner to advanced.

Safe Learning: Built-in security features prevent dangerous SQL operations.

✨ Key Features
Core Features

Assignment Listing: Browse SQL challenges with difficulty indicators.

Interactive SQL Editor: A Monaco Editor for SQL with syntax highlighting and shortcuts.

Real-Time Query Execution: Execute SQL queries against a PostgreSQL database with instant results.

Sample Data Viewer: Explore table schemas and data before writing queries.

AI-Powered Hints: Contextual guidance based on query progress.

Responsive Design: Mobile-first design supporting all device sizes.

Security Features

SQL Injection Prevention: Full query validation and sanitization to prevent malicious input.

Dangerous Operation Blocking: Prevents destructive commands (DROP, DELETE, etc.).

Rate Limiting: Protects APIs from abuse.

Input Validation: Ensures proper validation of all user inputs.

Educational Features

Progressive Difficulty: Levels ranging from beginner to advanced assignments.

Contextual Learning: Hints adjust based on difficulty and user progress.

Instant Feedback: Real-time error messages and success indicators.

Sample Data: Access realistic table schemas and sample data to guide learning.

🏗️ Technology Stack
Frontend

React.js 18.2.0 - Functional components with hooks.

Vanilla SCSS - Mobile-first design using BEM methodology.

Monaco Editor - A professional SQL code editor.

Axios - For handling API requests.

Backend

Node.js / Express.js - REST API server with middleware support.

PostgreSQL - Database for query execution (mock implementation).

MongoDB - Used for storing assignments and user data.

OpenAI API - Powers intelligent hint generation.

Development Tools

SCSS Architecture - Organized with variables, mixins, and partials.

ESLint - Ensures code quality and consistency.

Responsive Breakpoints - Supporting mobile to desktop devices (320px to 1281px).

📁 Project Structure
ciphersqlstudio/
├── client/                 # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── styles/         # SCSS files
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend application
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB models
│   ├── utils/              # Server-side utilities
│   ├── config/             # Configuration files
│   ├── scripts/            # Database scripts
│   └── package.json        # Backend dependencies
├── docs/                   # Documentation
│   ├── data-flow-diagram.md # System flow diagram
│   └── demo-guide.md       # Demo guide
├── .env.example           # Environment variables template
├── README.md              # This file
└── package.json           # Root configuration

🚀 Quick Start
Prerequisites

Node.js (v16 or higher)

PostgreSQL (for production)

MongoDB Atlas (for user data persistence)

OpenAI API Key (for AI-powered hints)

Installation Steps

Clone the repository

git clone <repository-url>
cd ciphersqlstudio


Install dependencies

npm run install-all


Set up environment variables
Configure your environment by editing the .env files in both the server/ and client/ directories.

Server Environment (server/.env):

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersqlstudio
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ciphersqlstudio_sandbox
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret


Client Environment (client/.env):

REACT_APP_API_URL=http://localhost:5000/api


Initialize the database (optional, but recommended for mock data)

cd server
npm run setup-db


Start the development servers

npm run dev

Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000/api

🧪 Testing
Automated Testing

Run the following to test full functionality:

# Test core functionality
node test-functionality.js

# Verify full-stack integration
node verify-full-stack.js

Manual Testing

Assignment Listing: Browse, search, and filter assignments.

Query Execution: Write and execute SQL queries with real-time results.

Hint System: Request intelligent hints for assistance.

Mobile Responsiveness: Test on multiple device sizes.

Error Handling: Try invalid queries to test security features.

📊 Data Flow

User Input: SQL query entered in Monaco Editor.

Frontend Validation: Basic syntax checks.

API Request: POST request to /api/queries/execute.

Backend Validation: Security checks and sanitization.

Query Execution: Execute against PostgreSQL.

Result Processing: Format results and metadata.

Database Logging: Log attempt to MongoDB.

API Response: Return formatted results or error messages.

UI Update: Display results in a table.

User Feedback: Execution time and row count shown.

Detailed system flow diagram available in docs/data-flow-diagram.md

🎨 Design Philosophy
Mobile-First Approach

320px: Mobile phones (portrait).

641px: Small tablets and large phones.

1024px: Tablets and small laptops.

1281px: Desktop and large screens.

SCSS Architecture

Variables: Centralized color, spacing, and typography.

Mixins: Reusable styles for components and responsiveness.

Nesting: Logical component hierarchy in styles.

BEM Methodology: Maintainable, clear class names.

User Experience

Intuitive Navigation: Easy-to-use interface with smooth transitions.

Immediate Feedback: Real-time query results and error messages.

Progressive Learning: Adaptive difficulty levels.

Accessibility: Full keyboard navigation and screen reader support.

🔒 Security Measures
Query Security

SQL Injection Prevention: Full query sanitization.

Dangerous Operation Blocking: Prevents destructive SQL commands (DROP, DELETE).

Query Validation: Validates SQL queries server-side.

Timeout Protection: Stops long-running queries.

API Security

Rate Limiting: Protects the API from overuse.

CORS Configuration: Controlled access from different domains.

Input Validation: Using Express-validator middleware.

Error Handling: Secure error responses without exposing sensitive data.

🎓 Educational Value
Learning Progression

Beginner: Simple SELECT queries, WHERE clauses.

Intermediate: JOINs, subqueries, aggregate functions.

Advanced: Complex queries, window functions, and optimization.

Intelligent Assistance

Context-Aware Hints: Adaptive AI hints based on user progress.

Error-Specific Help: Hints based on specific query errors.

Fallback Hints: General tips when AI is unavailable.
=======

>>>>>>> d564b1ffe9020f0c6e0efa184bbba2c0e9bfc914
