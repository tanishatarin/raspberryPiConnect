from flask import Flask, jsonify, request
from flask_cors import CORS
import RPi.GPIO as GPIO
import threading
import time

app = Flask(__name__)
CORS(app)  # This handles CORS more cleanly than manual headers

# GPIO Setup - using RPi.GPIO instead of gpiozero for more direct control
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Define GPIO pins
ROTARY_CLK = 27    # Clock pin
ROTARY_DT = 22     # Data pin
BUTTON_PIN = 25    # Button pin

# Setup pins
GPIO.setup(ROTARY_CLK, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(ROTARY_DT, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Global variables
counter = 30
counter_min = 30
counter_max = 200
clk_last_state = GPIO.input(ROTARY_CLK)
button_last_state = GPIO.input(BUTTON_PIN)
lock = threading.Lock()

def read_encoder():
    global counter, clk_last_state
    
    try:
        clk_state = GPIO.input(ROTARY_CLK)
        dt_state = GPIO.input(ROTARY_DT)
        
        if clk_state != clk_last_state:
            if dt_state != clk_state:
                # Clockwise rotation
                with lock:
                    counter = min(counter + 1, counter_max)
            else:
                # Counter-clockwise rotation
                with lock:
                    counter = max(counter - 1, counter_min)
            
            print(f"Counter: {counter}")
        
        clk_last_state = clk_state
    except Exception as e:
        print(f"Error reading encoder: {e}")

def check_button():
    global counter, button_last_state
    
    try:
        button_state = GPIO.input(BUTTON_PIN)
        
        # Button pressed (falling edge)
        if button_state == GPIO.LOW and button_last_state == GPIO.HIGH:
            with lock:
                counter = counter_min
            print(f"Button pressed, reset to {counter_min}")
            
        button_last_state = button_state
    except Exception as e:
        print(f"Error reading button: {e}")

# API endpoints
@app.route('/api/value', methods=['GET'])
def get_value():
    with lock:
        current = counter
    
    return jsonify({
        'value': current,
        'min': counter_min,
        'max': counter_max
    })

@app.route('/api/reset', methods=['POST'])
def reset_value():
    global counter
    
    with lock:
        counter = counter_min
    
    return jsonify({
        'success': True,
        'value': counter_min
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'gpio_enabled': True
    })

# Background thread function
def background_task():
    print("Background monitoring thread started")
    try:
        while True:
            read_encoder()
            check_button()
            time.sleep(0.01)  # 10ms polling interval
    except Exception as e:
        print(f"Background thread error: {e}")

if __name__ == '__main__':
    try:
        # Start background thread
        bg_thread = threading.Thread(target=background_task)
        bg_thread.daemon = True
        bg_thread.start()
        
        # Start Flask server
        print("Starting Flask server...")
        app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
    
    except KeyboardInterrupt:
        print("Stopping server...")
    finally:
        GPIO.cleanup()
        print("GPIO cleaned up")