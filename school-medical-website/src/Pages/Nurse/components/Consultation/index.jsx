import React, { useState, useEffect } from 'react';
import ConsultationDashboard from './ConsultationDashboard/ConsultationDashboard';
import ConsultationList from './ConsultationList/ConsultationList';
import ConsultationDetail from './ConsultationDetail/ConsultationDetail';
import CreateConsultation from './CreateConsultation/CreateConsultation';
import './Consultation.css';

const ConsultationManagement = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [listFilter, setListFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to handle navigation between views
  const handleViewChange = (view, filter = null) => {
    setActiveView(view);
    if (filter) {
      setListFilter(filter);
    } else if (view === 'dashboard' || view === 'create') {
      setListFilter(null);
    }
    
    if (view === 'dashboard' || view === 'list' || view === 'create') {
      setSelectedConsultation(null);
    }
  };

  // Function to handle consultation selection for detail view
  const handleConsultationSelect = (consultation) => {
    setSelectedConsultation(consultation);
    setActiveView('detail');
  };

  // Function to handle consultation creation
  const handleConsultationCreated = () => {
    // After creating a consultation, show the list view
    setActiveView('list');
  };

  // Function to handle consultation update
  const handleConsultationUpdated = () => {
    // After updating a consultation, refresh the detail view
    setActiveView('list');
  };
  
  // Function to toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Function to handle refresh action
  const handleRefresh = () => {
    // Refresh current view logic would go here
    console.log("Refreshing current view");
    // This would typically involve refetching data for the current view
  };
  
  // Function for export to Excel/PDF
  const handleExport = () => {
    console.log("Export functionality triggered");
    // Export logic would go here
  };
    // Function for settings/preferences
  const handleSettings = () => {
    console.log("Settings/preferences menu triggered");
    // Settings/preferences logic would go here
  };
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Apply dark mode class when it changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);
  return (
    <div className={`consultation-management ${isDarkMode ? 'dark-theme' : ''}`}>
      <div className="consultation-nav">
        <button 
          className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleViewChange('dashboard')}
        >
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </button>
        <button 
          className={`nav-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => handleViewChange('list')}
        >
          <i className="fas fa-list"></i>
          Danh sách tư vấn
        </button>
        <button 
          className={`nav-btn ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => handleViewChange('create')}
        >
          <i className="fas fa-plus-circle"></i>
          Tạo tư vấn mới
        </button>
          {/* Quick Actions Menu */}
        <div className="quick-actions-menu">
          <button 
            className={`quick-action-btn action-filter ${showFilters ? 'active' : ''}`} 
            onClick={toggleFilters}
            aria-label="Toggle filters"
          >
            <i className="fas fa-filter"></i>
            <span className="quick-action-label">Bộ lọc</span>
          </button>
          <button 
            className="quick-action-btn action-refresh" 
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            <i className="fas fa-sync-alt"></i>
            <span className="quick-action-label">Làm mới</span>
          </button>
          <button 
            className="quick-action-btn action-export" 
            onClick={handleExport}
            aria-label="Export data"
          >
            <i className="fas fa-file-export"></i>
            <span className="quick-action-label">Xuất dữ liệu</span>
          </button>
          <button 
            className="quick-action-btn action-theme-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            <span className="quick-action-label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            className="quick-action-btn action-settings" 
            onClick={handleSettings}
            aria-label="Settings"
          >
            <i className="fas fa-cog"></i>
            <span className="quick-action-label">Cài đặt</span>
          </button>
        </div>
      </div>
      <div className="consultation-content">        {activeView === 'dashboard' && (
          <ConsultationDashboard 
            onNavigateToList={(filter) => handleViewChange('list', filter)} 
            isDarkMode={isDarkMode}
          />
        )}{activeView === 'list' && (
          <ConsultationList 
            onConsultationSelect={handleConsultationSelect}
            onCreateNew={() => handleViewChange('create')}
            initialFilter={listFilter}
            showFilters={showFilters}
            isDarkMode={isDarkMode}
          />
        )}
        {activeView === 'detail' && selectedConsultation && (
          <ConsultationDetail 
            consultation={selectedConsultation} 
            onBack={() => handleViewChange('list')}
            onConsultationUpdated={handleConsultationUpdated} 
          />
        )}
        {activeView === 'create' && (
          <CreateConsultation 
            onBack={() => handleViewChange('list')}
            onConsultationCreated={handleConsultationCreated} 
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationManagement;
