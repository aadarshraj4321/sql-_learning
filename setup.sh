#!/bin/bash

# SQL Studio Setup Script
echo "Setting up SQL Studio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo " Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo " Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "  PostgreSQL is not installed or not in PATH."
    echo "Please install PostgreSQL and make sure it's running."
    echo "Visit: https://www.postgresql.org/download/"
fi

# Install root dependencies
echo " Installing root dependencies..."
npm install

# Install server dependencies
echo " Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo " Installing client dependencies..."
cd client
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f "server/.env" ]; then
    echo "Creating server environment file..."
    cp server/.env.example server/.env
    echo " Please edit server/.env with your database credentials and API keys"
fi

if [ ! -f "client/.env" ]; then
    echo "Creating client environment file..."
    cp client/.env.example client/.env
fi

echo ""
echo " Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env with your database credentials:"
echo "   - MongoDB Atlas connection string"
echo "   - PostgreSQL database credentials"
echo "   - OpenAI API key"
echo ""
echo "2. Set up your databases:"
echo "   npm run setup-db"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo ""
echo "Happy coding! "