import React, { useState, useEffect } from 'react';

const RotaryEncoderDisplay = () => {
  const [value, setValue] = useState(30);
  const [min, setMin] = useState(30);
  const [max, setMax] = useState(200);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Your Raspberry Pi's IP address - replace with your actual Pi's IP
  const PI_API_URL = 'http://raspberrypi.local:8080/api';
  
  // Function to fetch the current value
  const fetchValue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PI_API_URL}/value`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setValue(data.value);
      setMin(data.min);
      setMax(data.max);
      setError(null);
    } catch (err) {
      setError('Failed to connect to Raspberry Pi. Make sure the server is running.');
      console.error('Error fetching value:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset the value
  const resetValue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PI_API_URL}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setValue(data.value);
      setError(null);
    } catch (err) {
      setError('Failed to reset value. Make sure the server is running.');
      console.error('Error resetting value:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch value on component mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchValue();
    
    // Set up polling every 500ms
    const intervalId = setInterval(fetchValue, 500);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate percentage for progress bar
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Raspberry Pi Rotary Encoder</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : null}
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Current Value:</span>
            <span className="text-xl font-bold">{value}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="bg-blue-600 h-6 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={resetValue}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            Reset to 30
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">Instructions:</p>
          <ul className="list-disc pl-5">
            <li>Rotate the encoder to change values between {min}-{max}</li>
            <li>Press the button to reset the value to {min}</li>
            <li>Or click the Reset button above</li>
          </ul>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-500">
        Last updated: {loading ? 'Updating...' : new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default RotaryEncoderDisplay;