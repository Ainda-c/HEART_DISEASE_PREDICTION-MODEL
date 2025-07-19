#!/bin/bash

# Check Python version
echo "Python version:"
python --version

# Install Python dependencies with specific versions
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

echo "Build completed successfully!" 