from flask import Flask, jsonify
from gpiozero import RotaryEncoder, Button
import threading
import time
import os
import sys
import signal
import logging

app = Flask(__name__)

# Add CORS headers to allow requests from your React app
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Set up the rotary encoder (CLK=GPIO17, DT=GPIO18)
encoder = RotaryEncoder(27, 22, max_steps=200, wrap=False)

# Set up the button (SW=GPIO27)
button = Button(25)

# Starting value
encoder.steps = 30

# Global variable to track encoder value safely
current_value = 40

# Function to print the current value
def show_value():
    global current_value
    current_value = max(30, min(encoder.steps, 200))
    encoder.steps = current_value
    print(f"Current Value: {encoder.steps}")

# Function to reset the encoder value
def reset_value():
    global current_value
    encoder.steps = 30
    current_value = 30
    print("Reset to 30!")

# Attach event listeners
encoder.when_rotated = show_value
button.when_pressed = reset_value

# API endpoints for React
@app.route('/api/value', methods=['GET'])
def get_value():
    global current_value
    # Ensure we're returning the most up-to-date value
    current_value = max(30, min(encoder.steps, 200))
    return jsonify({
        'value': current_value,
        'min': 30,
        'max': 200
    })

@app.route('/api/reset', methods=['POST'])
def api_reset():
    reset_value()
    return jsonify({'success': True, 'value': current_value})

# Health check endpoint to verify the server is running
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("Rotary Encoder Server Started. Connect to /api/value to get current value.")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
    