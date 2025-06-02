import React, { useState, useEffect } from 'react';
import VaccinationDashboard from './Dashboard/VaccinationDashboard';
import VaccinationPlanManagement from './PlanManagement/VaccinationPlanManagement';
import VaccinationRecords from './VaccinationRecords/VaccinationRecordManagement';
import VaccinationStatistics from './StatisticsAndReports/VaccinationStatistics';
import VaccineManagement from './VaccineManagement/VaccineManagement';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Function to trigger a refresh of data across components
  const triggerRefresh = () => {
    setNeedsRefresh(true);
  };

  // Reset refresh flag after data has been refreshed
  useEffect(() => {
    if (needsRefresh) {
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);
  return (
    <div className="vaccination-management-container">
      <h1 className="page-title">Quản lý Tiêm chủng</h1>
      
      <div className="vaccination-tabs">
        <div className="vaccination-nav">
          <div 
            className={`vaccination-tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            <i className="fas fa-chart-line"></i> 
            <span>Tổng quan</span>
          </div>
          
          <div 
            className={`vaccination-tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <i className="fas fa-syringe"></i>
            <span>Quản lý Vaccine</span>
          </div>
          
          <div 
            className={`vaccination-tab ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Kế hoạch Tiêm chủng</span>
          </div>
          
          <div 
            className={`vaccination-tab ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => setActiveTab(3)}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Hồ sơ Tiêm chủng</span>
          </div>
          
          <div 
            className={`vaccination-tab ${activeTab === 4 ? 'active' : ''}`}
            onClick={() => setActiveTab(4)}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Thống kê & Báo cáo</span>
          </div>
        </div>
        
        <div className="vaccination-content">
          {activeTab === 0 && (
            <VaccinationDashboard 
              refreshData={needsRefresh}
              onDataChange={triggerRefresh}
            />
          )}
          
          {activeTab === 1 && (
            <VaccineManagement 
              refreshData={needsRefresh}
              onDataChange={triggerRefresh}
            />
          )}
          
          {activeTab === 2 && (
            <VaccinationPlanManagement 
              refreshData={needsRefresh}
              onDataChange={triggerRefresh}
            />
          )}
          
          {activeTab === 3 && (
            <VaccinationRecords 
              refreshData={needsRefresh}
              onDataChange={triggerRefresh}
            />
          )}
          
          {activeTab === 4 && (
            <VaccinationStatistics 
              refreshData={needsRefresh}
              onDataChange={triggerRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationManagement;
