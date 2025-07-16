import React from 'react';

const EmergencyTest: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ marginBottom: '20px' }}>🚨 EMERGENCY TEST 🚨</h1>
      <p>Si ves esto, React está funcionando!</p>
      <p style={{ fontSize: '16px', marginTop: '20px' }}>
        URL actual: {window.location.href}
      </p>
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>Hora: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default EmergencyTest;
