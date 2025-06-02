import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard/Dashboard';
import CheckupList from './CheckupList/CheckupList';
import CheckupResults from './CheckupResults/CheckupResults';
import Reports from './Reports/Reports';
import StudentDetail from './StudentDetail/StudentDetail';
import healthCheckupService from '../../../../services/healthCheckupService';
import './HealthCheckups.css';

const HealthCheckups = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [campaignsData, setCampaignsData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [healthStandards, setHealthStandards] = useState(null);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    upcomingCampaigns: 0,
    completedCampaigns: 0,
    followupStudents: 0
  });

  // Hàm này được gọi để cập nhật dữ liệu khi cần làm mới danh sách
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Lấy dữ liệu cơ bản khi component mount hoặc cần refresh
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách đợt khám
        const campaigns = await healthCheckupService.getAllCheckupCampaigns();
        setCampaignsData(campaigns);
        
        // Tính toán các số liệu thống kê
        const activeCampaigns = campaigns.filter(c => c.status === 'Đang diễn ra').length;
        const upcomingCampaigns = campaigns.filter(c => ['Sắp diễn ra', 'Chưa bắt đầu'].includes(c.status)).length;
        const completedCampaigns = campaigns.filter(c => c.status === 'Đã hoàn thành').length;
        
        // Lấy số học sinh cần theo dõi
        const studentsRequiringFollowup = await healthCheckupService.getStudentsRequiringFollowup();
        
        setStats({
          totalCampaigns: campaigns.length,
          activeCampaigns,
          upcomingCampaigns,
          completedCampaigns,
          followupStudents: studentsRequiringFollowup.length
        });
        
        // Lấy tiêu chuẩn sức khoẻ theo độ tuổi
        const healthStandardsData = await healthCheckupService.getHealthStandards();
        setHealthStandards(healthStandardsData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [refreshTrigger]);

  // Xử lý khi chọn một đợt khám để xem chi tiết
  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('results');
  };

  // Xử lý khi chọn một học sinh để xem chi tiết
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab('student-detail');
  };

  // Quay lại tab trước đó
  const handleBack = () => {
    if (activeTab === 'student-detail') {
      setActiveTab('results');
    } else if (activeTab === 'results') {
      setActiveTab('campaign-list');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="health-checkups-container">
      {/* Tabs điều hướng các chức năng */}
      <div className="health-checkups-tabs">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="fas fa-chart-line"></i> Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'campaign-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaign-list')}
        >
          <i className="fas fa-list"></i> Danh sách đợt khám
        </button>
        <button 
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-file-medical-alt"></i> Báo cáo
        </button>
        {(activeTab === 'results' || activeTab === 'student-detail') && (
          <button className="tab-button back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
        )}
      </div>
      
      {/* Hiển thị nội dung theo tab đang active */}
      <div className="health-checkups-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <Dashboard 
                stats={stats} 
                campaignsData={campaignsData} 
                onCampaignSelect={handleCampaignSelect}
                refreshData={refreshData}
              />
            )}
            
            {/* Campaign List */}
            {activeTab === 'campaign-list' && (
              <CheckupList 
                campaigns={campaignsData} 
                onCampaignSelect={handleCampaignSelect}
                refreshData={refreshData}
              />
            )}
            
            {/* Checkup Results */}
            {activeTab === 'results' && selectedCampaign && (
              <CheckupResults 
                campaign={selectedCampaign} 
                onStudentSelect={handleStudentSelect}
                refreshData={refreshData}
                healthStandards={healthStandards}
              />
            )}
            
            {/* Student Detail */}
            {activeTab === 'student-detail' && selectedStudent && (
              <StudentDetail 
                student={selectedStudent} 
                campaign={selectedCampaign}
                refreshData={refreshData}
                healthStandards={healthStandards}
              />
            )}
            
            {/* Reports */}
            {activeTab === 'reports' && (
              <Reports 
                campaigns={campaignsData} 
                refreshData={refreshData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthCheckups;
