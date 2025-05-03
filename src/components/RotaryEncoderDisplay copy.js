import React, { useState, useEffect } from 'react';

const RotaryEncoderDisplay = () => {
  const [value, setValue] = useState(30);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // For development only - set to true to use fake data instead of connecting to Pi
  const SIMULATION_MODE = false;
  
  // Your Raspberry Pi's IP address and port
  const PI_API_URL = 'http://raspberrypi.local:5000/api';
  
  // Function to fetch the current value
  const fetchValue = async () => {
    if (SIMULATION_MODE) {
      // In dev mode, just generate random values between 30-200
      setValue(Math.floor(Math.random() * (200 - 30 + 1)) + 30);
      setConnectionStatus('simulation');
      return;
    }
    
    try {
      const response = await fetch(`${PI_API_URL}/value`);
      
      if (response.ok) {
        const data = await response.json();
        setValue(data.value);
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (err) {
      console.error('Error fetching value:', err);
      setConnectionStatus('error');
    }
  };
  
  // Function to reset the encoder value
  const resetValue = async () => {
    if (SIMULATION_MODE) {
      setValue(30);
      return;
    }
    
    try {
      const response = await fetch(`${PI_API_URL}/reset`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setValue(data.value);
      }
    } catch (err) {
      console.error('Error resetting value:', err);
    }
  };
  
  // Fetch value on component mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchValue();
    
    // Set up polling every 200ms (more responsive)
    const intervalId = setInterval(fetchValue, 200);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Determine color based on connection status
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50'; // Green
      case 'error': return '#F44336'; // Red
      case 'simulation': return '#2196F3'; // Blue
      default: return '#FFC107'; // Yellow for connecting
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ 
        fontSize: '48px', 
        fontWeight: 'bold',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        minWidth: '200px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        {value}
      </div>
      
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: getStatusColor() 
        }}></div>
        <span>{connectionStatus === 'simulation' ? 'Simulation Mode' : 
               connectionStatus === 'connected' ? 'Connected to Raspberry Pi' : 
               connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}</span>
      </div>
      
      <button 
        onClick={resetValue}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#2196F3',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Reset to 30
      </button>
    </div>
  );
};

export default RotaryEncoderDisplay;