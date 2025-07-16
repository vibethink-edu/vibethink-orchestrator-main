/**
 * DiagnosticExplorer - Componente de diagnóstico
 */

import React, { useState } from 'react';

const DiagnosticExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            🎯 Diagnostic Explorer
          </h1>
          <p style={{ color: '#6b7280' }}>
            Panel de diagnóstico para el dashboard de administración
          </p>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeTab === 'dashboard' ? '#ffffff' : 'transparent',
                color: activeTab === 'dashboard' ? '#1f2937' : '#6b7280',
                fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                cursor: 'pointer',
                boxShadow: activeTab === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('status')}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeTab === 'status' ? '#ffffff' : 'transparent',
                color: activeTab === 'status' ? '#1f2937' : '#6b7280',
                fontWeight: activeTab === 'status' ? 'bold' : 'normal',
                cursor: 'pointer',
                boxShadow: activeTab === 'status' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Status
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Dashboard Principal
              </h2>
              
              {/* Metrics Grid */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  backgroundColor: '#eff6ff',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #dbeafe'
                }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '14px' }}>Total Revenue</h3>
                  <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>$45,231.89</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669' }}>+20.1% from last month</p>
                </div>
                
                <div style={{
                  backgroundColor: '#f0fdf4',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#16a34a', fontSize: '14px' }}>Subscriptions</h3>
                  <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>+2,350</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669' }}>+180.1% from last month</p>
                </div>
                
                <div style={{
                  backgroundColor: '#fffbeb',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: '14px' }}>Sales</h3>
                  <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>+12,234</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669' }}>+19% from last month</p>
                </div>
                
                <div style={{
                  backgroundColor: '#fdf2f8',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #fbcfe8'
                }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#be185d', fontSize: '14px' }}>Active Now</h3>
                  <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>+573</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669' }}>+201 since last hour</p>
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}>
                📊 Chart Area - Dashboard funcionando correctamente
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              System Status
            </h2>
            
            <div style={{ 
              display: 'grid',
              gap: '12px'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                <span style={{ marginRight: '8px' }}>✅</span>
                <span>Dashboard renderizado correctamente</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                <span style={{ marginRight: '8px' }}>✅</span>
                <span>Componentes básicos funcionando</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                <span style={{ marginRight: '8px' }}>✅</span>
                <span>Navegación entre tabs operativa</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                <span style={{ marginRight: '8px' }}>✅</span>
                <span>Estilos aplicados correctamente</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#eff6ff',
                borderRadius: '6px',
                border: '1px solid #dbeafe'
              }}>
                <span style={{ marginRight: '8px' }}>ℹ️</span>
                <span>Próximo paso: integrar componentes Bundui</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#475569' }}>Próximos pasos:</h3>
              <ol style={{ margin: 0, paddingLeft: '20px', color: '#64748b' }}>
                <li>Verificar imports de componentes Bundui</li>
                <li>Comprobar configuración de Tailwind CSS</li>
                <li>Testear componentes uno por uno</li>
                <li>Integrar sistema de autenticación</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticExplorer;
