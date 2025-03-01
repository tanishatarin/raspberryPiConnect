from flask import Flask, jsonify
from flask_cors import CORS
import gpiozero
from gpiozero import RotaryEncoder, Button
import threading
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up the rotary encoder (CLK=GPIO17, DT=GPIO18)
encoder = RotaryEncoder(27, 22, max_steps=200, wrap=False)
# Set up the button (SW=GPIO27)
button = Button(25)

# Starting value
encoder.steps = 30

# Current value storage (for thread safety)
current_value = 30

# Function to clamp values within 30-200
def update_value():
    global current_value
    current_value = max(30, min(encoder.steps, 200))
    encoder.steps = current_value

# Function to reset the encoder value
def reset_value():
    global current_value
    encoder.steps = 30
    current_value = 30
    print("Reset to 30!")

# Attach event listeners
encoder.when_rotated = update_value
button.when_pressed = reset_value

# API endpoints
@app.route('/api/value', methods=['GET'])
def get_value():
    return jsonify({
        'value': current_value,
        'min': 30,
        'max': 200
    })

@app.route('/api/reset', methods=['POST'])
def reset_endpoint():
    reset_value()
    return jsonify({'success': True, 'value': current_value})

# Background thread to update value periodically
def background_update():
    while True:
        update_value()
        time.sleep(0.1)

if __name__ == '__main__':
    # Start background thread
    bg_thread = threading.Thread(target=background_update)
    bg_thread.daemon = True
    bg_thread.start()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)