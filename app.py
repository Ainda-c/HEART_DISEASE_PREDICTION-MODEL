from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import joblib
import os
import numpy as np

app = Flask(__name__)
CORS(app)

#load model and scaler

model = joblib.load('heart_disease_model.pkl')
scaler = joblib.load('scaler.pkl')

# Define feature order for input

feature_order = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalch', 'exang', 'oldpeak']
@app.route('/')

def home():
        
        return send_from_directory('dist', 'index.html')
    

@app.route('/predict', methods = ['POST'])
def predict():
    try:
        #Get JSON Data
        data = request.get_json()

          # Create DataFrame with correct feature order
        input_data = pd.DataFrame([data], columns=feature_order)
        
         # Preprocess input
        input_transformed = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_transformed)[0]
        probabilities= model.predict_proba(input_transformed)[0]
        probability = probabilities[int(prediction)]

        # Return result
        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/<path:filename>')
def assets(filename):
    if os.path.exists(f'dist/assets/{filename}'):
        return send_from_directory('dist/assets', filename)
    elif os.path.exists(f'dist/{filename}'):
        return send_from_directory('dist', filename)
    else:
        return send_from_directory('dist', filename)
    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    print(f"Heart Disease Prediction API is running on http://localhost:{port}")
    app.run(debug=debug, host='0.0.0.0', port=port)






