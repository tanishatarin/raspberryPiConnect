import React from 'react';
import RotaryEncoderDisplay from './components/RotaryEncoderDisplay';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '15px' }}>
      <h1 style={{ color: '#333' }}>Raspberry Pi Rotary Encoder</h1>
      <RotaryEncoderDisplay className="y-4"/>
    </div>
  );
}

export default App;
