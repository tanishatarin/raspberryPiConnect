import React from 'react';
import RotaryEncoderDisplay from './components/RotaryEncoderDisplay';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '90vh',
      margin: 0,
      padding: 0
    }}>
      <h1>Raspberry Pi Rotary Encoder Value:</h1>
      <RotaryEncoderDisplay />
    </div>
  );
}

export default App;