import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import vaccinationService from '../../../../../services/vaccinationService';
import './VaccinationDashboard.css';

// Đăng ký components cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const VaccinationDashboard = ({ stats: propStats, loading: propLoading }) => {
  const [stats, setStats] = useState(propStats);
  const [loading, setLoading] = useState(propLoading);
  const [chartView, setChartView] = useState('monthly'); // monthly, quarterly, yearly

  // Tự động tải dữ liệu nếu không có được truyền vào
  useEffect(() => {
    if (!propStats && !propLoading) {
      loadDashboardData();
    } else {
      setStats(propStats);
      setLoading(propLoading);
    }
  }, [propStats, propLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await vaccinationService.getVaccinationStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Xử lý dữ liệu cho biểu đồ
  const processVaccinationData = () => {
    const totalStudents = stats.totalStudents || 0;
    const studentsWithVaccination = stats.studentsWithVaccination || 0;
    const studentsWithoutVaccination = stats.studentsWithoutVaccination || 0;
    
    // Dữ liệu tỷ lệ tiêm chủng học sinh
    const pieData = {
      labels: ['Đã tiêm chủng', 'Chưa tiêm chủng'],
      datasets: [
        {
          data: [studentsWithVaccination, studentsWithoutVaccination],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverBackgroundColor: ['#388e3c', '#d32f2f'],
          borderWidth: 0,
        },
      ],
    };

    // Dữ liệu tỷ lệ tiêm từng loại vaccine
    const vaccineStatsData = stats.vaccineStats ? {
      labels: stats.vaccineStats.map(vs => vs.vaccineName),
      datasets: [
        {
          label: 'Tỷ lệ tiêm chủng (%)',
          data: stats.vaccineStats.map(vs => vs.percentage),
          backgroundColor: stats.vaccineStats.map((_, i) => 
            `rgba(${54 + i * 50}, ${162 - i * 20}, ${235 - i * 30}, 0.7)`
          ),
          borderWidth: 1,
        },
      ],
    } : {
      labels: [],
      datasets: [{ data: [], backgroundColor: [], borderWidth: 1 }],
    };

    return {
      pieData,
      vaccineStatsData,
    };
  };

  const { pieData, vaccineStatsData } = processVaccinationData();

  // Kiểm tra và định dạng ngày hợp lệ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Chưa có ngày" : date.toLocaleDateString('vi-VN');
    } catch {
      return "Chưa có ngày";
    }
  };

  // Hàm tính số ngày trước khi hết hạn
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Màu sắc dựa vào trạng thái tiêm chủng
  const getStatusColor = (daysRemaining) => {
    if (daysRemaining <= 7) return 'critical';
    if (daysRemaining <= 30) return 'warning';
    return 'normal';
  };

  return (
    <div className="vaccination-dashboard">
      <div className="dashboard-summary">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalStudents || 0}</h3>
              <p>Tổng số học sinh</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon vaccinated">
              <i className="fas fa-syringe"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.studentsWithVaccination || 0}</h3>
              <p>Học sinh đã tiêm chủng</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon unvaccinated">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.studentsWithoutVaccination || 0}</h3>
              <p>Học sinh chưa tiêm chủng</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon coverage">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.percentageVaccinated || 0}%</h3>
              <p>Tỷ lệ bao phủ</p>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Tỷ lệ học sinh đã tiêm chủng</h3>
            <div className="chart-wrapper">
              <Pie data={pieData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} học sinh (${percentage}%)`;
                      }
                    }
                  }
                }}} />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Tỷ lệ tiêm chủng theo loại Vaccine</h3>
            <div className="chart-wrapper">
              <Bar data={vaccineStatsData} options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Phần trăm (%)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.raw}% học sinh đã tiêm`;
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-alerts">
        <div className="upcoming-vaccinations">
          <h3>Mũi tiêm sắp đến hạn</h3>
          {stats.upcomingVaccinations && stats.upcomingVaccinations.length > 0 ? (
            <table className="upcoming-table">
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>Lớp</th>
                  <th>Vaccine</th>
                  <th>Ngày dự kiến</th>
                  <th>Còn lại</th>
                </tr>
              </thead>
              <tbody>
                {stats.upcomingVaccinations.map((vaccination, index) => (
                  <tr key={`upcoming-${index}`}>
                    <td>{vaccination.studentName}</td>
                    <td>{vaccination.className}</td>
                    <td>{vaccination.vaccineName}</td>
                    <td>{formatDate(vaccination.dueDate)}</td>
                    <td>
                      <span className={`days-remaining ${getStatusColor(vaccination.daysRemaining)}`}>
                        {vaccination.daysRemaining} ngày
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">
              <i className="fas fa-info-circle"></i>
              <p>Không có mũi tiêm nào sắp đến hạn</p>
            </div>
          )}
        </div>
        
        <div className="expiring-vaccines">
          <h3>Vaccine sắp hết hạn</h3>
          {stats.expiringVaccines && stats.expiringVaccines.length > 0 ? (
            <table className="expiring-table">
              <thead>
                <tr>
                  <th>Vaccine</th>
                  <th>Lô</th>
                  <th>Số lượng còn lại</th>
                  <th>Ngày hết hạn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.expiringVaccines.map((vaccine, index) => (
                  <tr key={`expiring-${index}`}>
                    <td>{vaccine.name}</td>
                    <td>{vaccine.batchNumber}</td>
                    <td>{vaccine.remainingDoses}</td>
                    <td>{formatDate(vaccine.expiryDate)}</td>
                    <td>
                      <span className={`status-badge ${getDaysUntilExpiry(vaccine.expiryDate) <= 30 ? 'critical' : 'warning'}`}>
                        {getDaysUntilExpiry(vaccine.expiryDate) <= 30 ? 'Gấp' : 'Sắp hết hạn'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">
              <i className="fas fa-info-circle"></i>
              <p>Không có vaccine nào sắp hết hạn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationDashboard;