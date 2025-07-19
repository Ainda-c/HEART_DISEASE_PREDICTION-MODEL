# Heart Disease Prediction App

An AI-powered heart disease risk assessment tool built with React frontend and Flask backend.

## Features

- Interactive form for patient data input
- Real-time heart disease risk prediction
- Modern, responsive UI with Tailwind CSS
- Machine learning model for accurate predictions

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Flask + Python
- **ML**: Scikit-learn
- **Deployment**: Render

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   python app.py
   ```

3. Open http://localhost:5000

## Deployment on Render

This app is configured for deployment on Render. The deployment process:

1. Installs Python dependencies
2. Installs Node.js dependencies  
3. Builds the React frontend
4. Starts the Flask server

### Environment Variables

- `PORT`: Server port (default: 5000)
- `FLASK_ENV`: Environment mode (development/production)

## API Endpoints

- `GET /`: Serves the React frontend
- `POST /predict`: Heart disease prediction endpoint

## Model Information

The app uses a trained machine learning model (`heart_disease_model.pkl`) and scaler (`scaler.pkl`) for predictions based on patient parameters including age, sex, chest pain type, blood pressure, cholesterol, and other medical indicators. 