import React, { useState } from 'react';
import clsx from 'clsx';

const RoadmapProgress = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '📊 Todas', count: 30 },
    { id: 'auth', label: '🔐 Autenticación', count: 5 },
    { id: 'dashboard', label: '📊 Dashboard', count: 5 },
    { id: 'ai', label: '🤖 AI', count: 5 },
    { id: 'business', label: '💼 Empresas', count: 5 },
    { id: 'dev', label: '🛠️ Desarrollo', count: 5 },
  ];

  const features = {
    auth: [
      { name: 'Autenticación Multi-tenant', status: 'implemented', date: 'Implementado' },
      { name: 'Roles y Permisos', status: 'implemented', date: 'Implementado' },
      { name: 'SSO Integration', status: 'in-development', date: 'Q4 2025' },
      { name: '2FA Authentication', status: 'planned', date: 'Q1 2026' },
      { name: 'Biometric Auth', status: 'planned', date: 'Q2 2026' },
    ],
    dashboard: [
      { name: 'Dashboard Principal', status: 'implemented', date: 'Implementado' },
      { name: 'Gráficos Interactivos', status: 'implemented', date: 'Implementado' },
      { name: 'Real-time Analytics', status: 'in-development', date: 'Q4 2025' },
      { name: 'AI-Powered Insights', status: 'planned', date: 'Q1 2026' },
      { name: 'Custom Reports', status: 'planned', date: 'Q2 2026' },
    ],
    ai: [
      { name: 'OpenAI Integration', status: 'implemented', date: 'Implementado' },
      { name: 'Firecrawl Integration', status: 'implemented', date: 'Implementado' },
      { name: 'Knotie Agent', status: 'in-development', date: 'Q4 2025' },
      { name: 'AI Code Assistant', status: 'planned', date: 'Q1 2026' },
      { name: 'Predictive Analytics', status: 'planned', date: 'Q2 2026' },
    ],
    business: [
      { name: 'Multi-tenant Architecture', status: 'implemented', date: 'Implementado' },
      { name: 'User Management', status: 'implemented', date: 'Implementado' },
      { name: 'Billing System', status: 'in-development', date: 'Q4 2025' },
      { name: 'White-label Solution', status: 'planned', date: 'Q1 2026' },
      { name: 'API Rate Limiting', status: 'planned', date: 'Q2 2026' },
    ],
    dev: [
      { name: 'Dev Portal', status: 'implemented', date: 'Implementado' },
      { name: 'Component Library', status: 'implemented', date: 'Implementado' },
      { name: 'Testing Framework', status: 'in-development', date: 'Q4 2025' },
      { name: 'CI/CD Pipeline', status: 'planned', date: 'Q1 2026' },
      { name: 'Performance Monitoring', status: 'planned', date: 'Q2 2026' },
    ],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented':
        return '✅';
      case 'in-development':
        return '🔄';
      case 'planned':
        return '🚀';
      default:
        return '❓';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'implemented':
        return 'status-implemented';
      case 'in-development':
        return 'status-in-development';
      case 'planned':
        return 'status-planned';
      default:
        return '';
    }
  };

  const currentFeatures = selectedCategory === 'all' 
    ? Object.values(features).flat()
    : features[selectedCategory] || [];

  const stats = {
    implemented: currentFeatures.filter(f => f.status === 'implemented').length,
    inDevelopment: currentFeatures.filter(f => f.status === 'in-development').length,
    planned: currentFeatures.filter(f => f.status === 'planned').length,
  };

  const total = currentFeatures.length;
  const implementedPercent = total > 0 ? Math.round((stats.implemented / total) * 100) : 0;
  const inDevelopmentPercent = total > 0 ? Math.round((stats.inDevelopment / total) * 100) : 0;
  const plannedPercent = total > 0 ? Math.round((stats.planned / total) * 100) : 0;

  return (
    <div className="roadmap-component">
      {/* Category Filter */}
      <div className="category-filter">
        <h3>Filtrar por Categoría:</h3>
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category.id}
              className={clsx('filter-btn', {
                'active': selectedCategory === category.id
              })}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-item">
          <span className="stat-number">{stats.implemented}</span>
          <span className="stat-label">Implementado</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.inDevelopment}</span>
          <span className="stat-label">En Desarrollo</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.planned}</span>
          <span className="stat-label">Planeado</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress implemented" 
            style={{width: `${implementedPercent}%`}}
            title={`${implementedPercent}% Implementado`}
          >
            {implementedPercent > 10 && `${implementedPercent}%`}
          </div>
          <div 
            className="progress in-development" 
            style={{width: `${inDevelopmentPercent}%`}}
            title={`${inDevelopmentPercent}% En Desarrollo`}
          >
            {inDevelopmentPercent > 10 && `${inDevelopmentPercent}%`}
          </div>
          <div 
            className="progress planned" 
            style={{width: `${plannedPercent}%`}}
            title={`${plannedPercent}% Planeado`}
          >
            {plannedPercent > 10 && `${plannedPercent}%`}
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="features-list">
        <h3>Funcionalidades {selectedCategory !== 'all' ? `- ${categories.find(c => c.id === selectedCategory)?.label.split(' ')[1]}` : ''}</h3>
        <div className="features-grid">
          {currentFeatures.map((feature, index) => (
            <div key={index} className={clsx('feature-card', getStatusClass(feature.status))}>
              <div className="feature-header">
                <span className="status-icon">{getStatusIcon(feature.status)}</span>
                <span className="feature-name">{feature.name}</span>
              </div>
              <div className="feature-date">{feature.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapProgress; 