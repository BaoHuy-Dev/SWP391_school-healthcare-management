import React, { useState } from 'react';
import StudentList from './StudentList/StudentList';
import HealthReports from './HealthReports/HealthReports';
import './StudentRecords.css';

const StudentRecords = () => {
  const [activeTab, setActiveTab] = useState('list');
  
  return (
    <div className="student-records-container">
      <div className="student-records-tabs">
        <div 
          className={`sr-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <i className="fas fa-list"></i>
          Danh sách học sinh
        </div>
        <div 
          className={`sr-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-chart-bar"></i>
          Báo cáo sức khỏe
        </div>
      </div>
      
      <div className="student-records-content">
        {activeTab === 'list' && <StudentList />}
        {activeTab === 'reports' && <HealthReports />}
      </div>
    </div>
  );
};

export default StudentRecords;
