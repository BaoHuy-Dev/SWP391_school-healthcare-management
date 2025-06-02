import React, { useState, useEffect } from 'react';
import './VaccinationManagement.css';
import vaccinationService from '../../../../../services/vaccinationService';

// Sub-components (import từ các thư mục mới)
import VaccinationDashboard from '../Dashboard/VaccinationDashboard';
import VaccineManagement from '../VaccineManagement/VaccineManagement';
import StudentVaccinationRecords from '../StudentRecords/StudentVaccinationRecords';
import VaccinationRecordManagement from '../VaccinationRecords/VaccinationRecordManagement';
import VaccinationPlanManagement from '../PlanManagement/VaccinationPlanManagement';
import VaccinationReports from '../Reports/VaccinationReports';

const VaccinationManagement = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Thêm state cho modal và form
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [students, setStudents] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await vaccinationService.getVaccinationStats();
        setStats(statsData);
        
        // Lấy thêm dữ liệu học sinh và vaccine nếu cần
        const studentsData = await vaccinationService.getAllStudents();
        const vaccinesData = await vaccinationService.getAllVaccines();
        
        setStudents(studentsData);
        setVaccines(vaccinesData);
      } catch (error) {
        console.error("Failed to fetch vaccination stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to refresh data when needed
  const refreshData = async () => {
    try {
      setLoading(true);
      const statsData = await vaccinationService.getVaccinationStats();
      setStats(statsData);
      return true;
    } catch (error) {
      console.error("Failed to refresh data:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Lấy tiêu đề dựa vào tab đang active
  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard':
        return 'Tổng quan tiêm chủng';
      case 'vaccines':
        return 'Quản lý Vaccine';
      case 'student-records':
        return 'Hồ sơ Tiêm chủng';
      case 'vaccination-records':
        return 'Ghi nhận Tiêm chủng';
      case 'vaccination-plans':
        return 'Kế hoạch Tiêm chủng';
      case 'reports':
        return 'Thống kê & Báo cáo';
      default:
        return 'Tổng quan tiêm chủng';
    }
  };
  
  // Render appropriate content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <VaccinationDashboard stats={stats} loading={loading} />;
      case 'vaccines':
        return <VaccineManagement refreshData={refreshData} />;
      case 'student-records':
        return <StudentVaccinationRecords refreshData={refreshData} />;
      case 'vaccination-records':
        return <VaccinationRecordManagement refreshData={refreshData} />;
      case 'vaccination-plans':
        return <VaccinationPlanManagement refreshData={refreshData} />;
      case 'reports':
        return <VaccinationReports stats={stats} />;
      default:
        return <VaccinationDashboard stats={stats} loading={loading} />;
    }
  };

  return (
    <div className="vaccination-management">
      
      <div className="vaccination-container">
        {/* Navbar bên trái */}
        <div className="vaccination-sidebar">
          <ul className="side-nav">
            <li 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Tổng quan</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'vaccines' ? 'active' : ''}`}
              onClick={() => setActiveTab('vaccines')}
            >
              <i className="fas fa-syringe"></i>
              <span>Quản lý Vaccine</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'student-records' ? 'active' : ''}`}
              onClick={() => setActiveTab('student-records')}
            >
              <i className="fas fa-user-graduate"></i>
              <span>Hồ sơ Tiêm chủng</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'vaccination-records' ? 'active' : ''}`}
              onClick={() => setActiveTab('vaccination-records')}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Ghi nhận Tiêm chủng</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'vaccination-plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('vaccination-plans')}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Kế hoạch Tiêm chủng</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Thống kê & Báo cáo</span>
            </li>
          </ul>
        </div>

        {/* Nội dung chính */}
        <div className="vaccination-content">
          <div className="content-header">
            <h2>{getTabTitle()}</h2>
            <p className="last-updated">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="content-body">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationManagement;