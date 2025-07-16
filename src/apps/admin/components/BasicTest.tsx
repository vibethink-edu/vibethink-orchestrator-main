import React from 'react';

const BasicTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🎯 Test Basic Explorer
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#555' }}>Dashboard Test</h2>
        <p>Este es un componente básico de prueba para verificar que la aplicación funciona correctamente.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #bbdefb'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Revenue</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>$45,231.89</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>+20.1% from last month</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #c8e6c9'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#388e3c' }}>Users</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>+2,350</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>+180.1% from last month</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fff3e0', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #ffcc02'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Sales</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>+12,234</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>+19% from last month</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fce4ec', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #f8bbd9'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#c2185b' }}>Active</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>+573</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>+201 since last hour</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#555' }}>Status</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            ✅ Componente básico funcionando
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            ✅ Estilos inline aplicados
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            ✅ Sin dependencias externas
          </li>
          <li style={{ padding: '8px 0' }}>
            ✅ Renderizado correctamente
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BasicTest;
