import React, { useState, useEffect } from 'react';

const RotaryEncoderDisplay = () => {
  const [value, setValue] = useState(30);
  
  // For development only - set to true to use fake data instead of connecting to Pi
  const SIMULATION_MODE = false;
  
  // Your Raspberry Pi's IP address - replace with your actual Pi's IP
  const PI_API_URL = 'http://raspberrypi.local:8080/api';
  
  // Function to fetch the current value
  const fetchValue = async () => {
    if (SIMULATION_MODE) {
      // In dev mode, just generate random values between 30-200
      setValue(Math.floor(Math.random() * (200 - 30 + 1)) + 30);
      return;
    }
    
    try {
      const response = await fetch(`${PI_API_URL}/value`);
      
      if (response.ok) {
        const data = await response.json();
        setValue(data.value);
      }
    } catch (err) {
      console.error('Error fetching value:', err);
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
  
  return (
    <div style={{ 
      fontSize: '48px', 
      fontWeight: 'bold',
      padding: '20px',
      borderRadius: '10px',
    }}>
      {value}
    </div>
  );
};

export default RotaryEncoderDisplay;