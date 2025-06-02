import React, { useState, useEffect } from 'react';
import vaccinationService from '../../../../../services/vaccinationService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './VaccinationStatistics.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const VaccinationStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('year'); // all, year, month

  useEffect(() => {
    fetchStatistics();
  }, [selectedTimeFrame]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch vaccination statistics
      const data = await vaccinationService.getVaccinationStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load statistics:", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType) => {
    try {
      setLoading(true);
      const result = await vaccinationService.exportVaccinationReport(reportType, {
        timeFrame: selectedTimeFrame
      });
      
      // Create a download link for the report
      const link = document.createElement('a');
      link.href = result.fileUrl;
      link.download = `VaccinationReport_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert("Xuất báo cáo thành công!");
    } catch (err) {
      console.error("Failed to export report:", err);
      alert("Không thể xuất báo cáo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the vaccination coverage pie chart
  const coverageChartData = {
    labels: ['Đã tiêm chủng', 'Chưa tiêm chủng'],
    datasets: [
      {
        data: stats ? [stats.studentsWithVaccination, stats.studentsWithoutVaccination] : [0, 0],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for vaccine-specific chart
  const vaccineChartData = {
    labels: stats ? stats.vaccineStats.map(vs => vs.vaccineCode) : [],
    datasets: [
      {
        label: 'Tỷ lệ tiêm chủng',
        data: stats ? stats.vaccineStats.map(vs => vs.percentage) : [],
        backgroundColor: stats ? stats.vaccineStats.map(vs => 
          vs.mandatory ? 'rgba(75, 192, 192, 0.8)' : 'rgba(153, 102, 255, 0.8)'
        ) : [],
        borderColor: stats ? stats.vaccineStats.map(vs => 
          vs.mandatory ? 'rgb(75, 192, 192)' : 'rgb(153, 102, 255)'
        ) : [],
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tỷ lệ tiêm chủng theo loại vaccine (%)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Tỷ lệ (%)'
        }
      }
    }
  };

  return (
    <div className="vaccination-statistics">
      <div className="section-header">
        <div className="header-title">
          <h2>Thống kê và Báo cáo</h2>
          <p className="subtitle">Phân tích dữ liệu tiêm chủng và xuất báo cáo</p>
        </div>
        
        <div className="header-actions">
          <select 
            value={selectedTimeFrame}
            onChange={(e) => setSelectedTimeFrame(e.target.value)}
            className="time-frame-selector"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="year">Năm hiện tại</option>
            <option value="month">Tháng hiện tại</option>
          </select>
          
          <button className="btn-primary export-btn" onClick={() => exportReport('summary')}>
            <i className="fas fa-download"></i> Xuất báo cáo
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchStatistics}>
            Thử lại
          </button>
        </div>
      ) : stats ? (
        <div className="stats-container">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-content">
                <h3>Tổng số học sinh</h3>
                <span className="stat-value">{stats.totalStudents}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-syringe"></i>
              </div>
              <div className="stat-content">
                <h3>Đã tiêm chủng</h3>
                <span className="stat-value">{stats.studentsWithVaccination}</span>
                <span className="stat-percentage">
                  ({stats.percentageVaccinated}%)
                </span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-times"></i>
              </div>
              <div className="stat-content">
                <h3>Chưa tiêm chủng</h3>
                <span className="stat-value">{stats.studentsWithoutVaccination}</span>
                <span className="stat-percentage">
                  ({100 - stats.percentageVaccinated}%)
                </span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className="stat-content">
                <h3>Tiêm chủng sắp tới</h3>
                <span className="stat-value">{stats.upcomingVaccinations.length}</span>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <h3>Tỉ lệ tiêm chủng</h3>
              <div className="pie-chart-container">
                <Pie data={coverageChartData} />
              </div>
            </div>
            
            <div className="chart-container wide">
              <h3>Tỉ lệ tiêm theo loại vaccine</h3>
              <div className="bar-chart-container">
                <Bar data={vaccineChartData} options={barOptions} />
              </div>
            </div>
          </div>
          
          {/* Upcoming Vaccinations */}
          <div className="upcoming-vaccinations">
            <h3>
              <i className="fas fa-calendar-alt"></i> 
              Lịch tiêm chủng sắp tới
            </h3>
            
            <div className="upcoming-list">
              {stats.upcomingVaccinations.length > 0 ? (
                <table className="upcoming-table">
                  <thead>
                    <tr>
                      <th>Học sinh</th>
                      <th>Lớp</th>
                      <th>Vaccine</th>
                      <th>Ngày hết hạn</th>
                      <th>Còn lại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.upcomingVaccinations.map(item => (
                      <tr key={item.id}>
                        <td>{item.studentName}</td>
                        <td>{item.className}</td>
                        <td>{item.vaccineName}</td>
                        <td>{new Date(item.dueDate).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`days-remaining ${item.daysRemaining <= 7 ? 'urgent' : 'normal'}`}>
                            {item.daysRemaining} ngày
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-message">
                  <i className="fas fa-check-circle"></i>
                  <p>Không có lịch tiêm chủng sắp tới trong thời gian này.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Export Options */}
          <div className="export-options">
            <h3>
              <i className="fas fa-file-export"></i> 
              Xuất báo cáo
            </h3>
            
            <div className="export-buttons">
              <button className="export-option-btn" onClick={() => exportReport('summary')}>
                <i className="fas fa-file-csv"></i>
                <span>Báo cáo tổng hợp</span>
              </button>
              
              <button className="export-option-btn" onClick={() => exportReport('detailed')}>
                <i className="fas fa-file-csv"></i>
                <span>Báo cáo chi tiết</span>
              </button>
              
              <button className="export-option-btn" onClick={() => exportReport('upcoming')}>
                <i className="fas fa-file-csv"></i>
                <span>Danh sách tiêm chủng sắp tới</span>
              </button>
              
              <button className="export-option-btn" onClick={() => exportReport('incomplete')}>
                <i className="fas fa-file-csv"></i>
                <span>Danh sách học sinh chưa tiêm chủng</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data-container">
          <i className="fas fa-database"></i>
          <p>Không có dữ liệu thống kê để hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default VaccinationStatistics;
