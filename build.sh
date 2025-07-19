#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Build the React app
npm run build

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy built files to dist directory
cp -r dist/* dist/ 2>/dev/null || true 