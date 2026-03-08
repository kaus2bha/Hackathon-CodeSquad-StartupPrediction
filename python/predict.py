import sys
import json
import pickle
import numpy as np
from pathlib import Path

# Cache model and scaler to avoid reloading on every invocation
_CACHED_MODEL = None
_CACHED_SCALER = None

def load_model():
    """Load the trained model and scaler (with simple in-process cache)."""
    global _CACHED_MODEL, _CACHED_SCALER
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL, _CACHED_SCALER
    try:
        script_dir = Path(__file__).parent.parent
        model_path = script_dir / 'models' / 'startup_model.pkl'
        with open(model_path, 'rb') as f:
            _CACHED_MODEL = pickle.load(f)
        scaler_path = script_dir / 'models' / 'scaler.pkl'
        _CACHED_SCALER = None
        if scaler_path.exists():
            with open(scaler_path, 'rb') as f:
                _CACHED_SCALER = pickle.load(f)
        return _CACHED_MODEL, _CACHED_SCALER
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None, None

def predict(features):
    """Make prediction using the loaded model"""
    try:
        model, scaler = load_model()
        
        if model is None:
            # Fallback prediction if model loading fails
            return fallback_prediction(features)
        
        # Convert features to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features if scaler exists
        if scaler is not None:
            features_array = scaler.transform(features_array)
        
        # Make prediction
        prediction_proba = model.predict_proba(features_array)[0]
        prediction = model.predict(features_array)[0]
        
        # Get confidence (probability of predicted class)
        confidence = max(prediction_proba) * 100
        
        # Convert prediction to string
        prediction_str = 'Success' if prediction == 1 else 'Failure'
        
        return {
            'prediction': prediction_str,
            'confidence': round(confidence, 2),
            'success_probability': round(prediction_proba[1] * 100, 2),
            'failure_probability': round(prediction_proba[0] * 100, 2)
        }
        
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        return fallback_prediction(features)

def fallback_prediction(features):
    """Simple fallback prediction when model is not available"""
    # Simple rule-based prediction for 3 features
    funding, team_size, years = features
    score = 0
    # Funding score (0-40 points)
    if funding > 0.5: score += 40
    elif funding > 0.3: score += 30
    elif funding > 0.1: score += 20
    elif funding > 0.05: score += 10
    # Team size score (0-30 points)
    if team_size > 0.2: score += 30
    elif team_size > 0.1: score += 20
    elif team_size > 0.05: score += 10
    # Years score (0-30 points)
    if years > 0.4: score += 30
    elif years > 0.2: score += 20
    elif years > 0.1: score += 10
    confidence = min(score, 100)
    prediction = 'Success' if score >= 60 else 'Failure'
    return {
        'prediction': prediction,
        'confidence': round(confidence, 2),
        'success_probability': round(confidence if prediction == 'Success' else 100 - confidence, 2),
        'failure_probability': round(100 - confidence if prediction == 'Success' else confidence, 2)
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            # Parse features from command line argument
            features = json.loads(sys.argv[1])
            result = predict(features)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({
                'error': str(e),
                'prediction': 'Failure',
                'confidence': 50.0
            }))
    else:
        print(json.dumps({
            'error': 'No features provided',
            'prediction': 'Failure',
            'confidence': 50.0
        }))
