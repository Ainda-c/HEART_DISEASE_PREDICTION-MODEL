#!/bin/bash
set -e

echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "Installing Python dependencies with --only-binary=all..."
pip install --only-binary=all -r requirements.txt

echo "Installing Node.js dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Build completed successfully!" 