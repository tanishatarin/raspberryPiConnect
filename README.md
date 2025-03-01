# Raspberry Pi Rotary Encoder React App

This project consists of two parts:
1. A Python Flask server that runs on your Raspberry Pi to read GPIO values
2. A React frontend app that displays the rotary encoder value

## Server Setup (Raspberry Pi)

1. **Install required dependencies**

```bash
sudo apt-get update
sudo apt-get install python3-pip python3-gpiozero
pip3 install flask flask-cors
```

2. **Create the server file**

Create a file named `server.py` with the content from the provided server code.

3. **Run the server**

```bash
python3 server.py
```

The server will start on port 5000. Make sure your Raspberry Pi's firewall allows connections to this port.

## React App Setup (Development Machine)

1. **Create a new React app**

```bash
npx create-react-app raspberry-pi-rotary-encoder
cd raspberry-pi-rotary-encoder
```

2. **Install required dependencies**

```bash
npm install tailwindcss postcss autoprefixer
```

3. **Set up Tailwind CSS**

```bash
npx tailwindcss init -p
```

4. **Replace/add the files**

Replace or add the files provided in this guide to your project:
- `src/App.js`
- `src/index.js`
- `src/index.css`
- `src/components/RotaryEncoderDisplay.js` (create this directory and file)
- `tailwind.config.js`

5. **Configure the Raspberry Pi IP address**

In `src/components/RotaryEncoderDisplay.js`, make sure to replace `http://raspberrypi.local:5000/api` with your Raspberry Pi's actual IP address if "raspberrypi.local" doesn't work for you:

```javascript
const PI_API_URL = 'http://YOUR_PI_IP_ADDRESS:5000/api';
```

6. **Start the development server**

```bash
npm start
```

Your browser should open to `http://localhost:3000` with the rotary encoder display.

## Additional Notes

- Make sure your Raspberry Pi and development machine are on the same network.
- If you have trouble connecting, try using the Raspberry Pi's IP address instead of hostname.
- The app polls the server every 500ms for updates. You can adjust this timing if needed.
- GPIO pin numbers can be modified in the `server.py` file if your wiring is different.

## Deploying to Production

To build the app for production:

```bash
npm run build
```

This creates an optimized build in the `build` folder that you can deploy to a web server.