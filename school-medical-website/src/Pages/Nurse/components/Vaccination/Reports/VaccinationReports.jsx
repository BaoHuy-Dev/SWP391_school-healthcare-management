import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import vaccinationService from '../../../../../services/vaccinationService';
import './VaccinationReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const VaccinationReports = ({ stats: propStats }) => {
  const [stats, setStats] = useState(propStats);
  const [loading, setLoading] = useState(!propStats);
  const [timeFrame, setTimeFrame] = useState('month');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [vaccineFilter, setVaccineFilter] = useState('all');
  const [reportType, setReportType] = useState('coverage');
  
  // Fetch data if not provided as props
  useEffect(() => {
    if (!propStats) {
      fetchReportData();
    }
  }, [propStats]);
  
  // Fetch data when filters change
  useEffect(() => {
    fetchReportData();
  }, [timeFrame, gradeFilter, vaccineFilter, reportType]);
  
  const fetchReportData = async () => {
    try {
      setLoading(true);
      // In real implementation we would pass filters to the API
      const reportData = await vaccinationService.getVaccinationStats({
        timeFrame,
        grade: gradeFilter,
        vaccine: vaccineFilter,
        reportType
      });
      setStats(reportData);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading || !stats) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  // Prepare chart data based on the current filter settings
  const coverageData = {
    labels: ['Hoàn thành', 'Đang tiến hành', 'Chưa tiêm'],
    datasets: [
      {
        data: [stats.fullyVaccinated || 0, stats.partiallyVaccinated || 0, stats.notVaccinated || 0],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 0,
      },
    ],
  };
  // Generate data for grade-based vaccination rates
  const gradeData = {
    labels: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9', 'Khối 10', 'Khối 11', 'Khối 12'],
    datasets: [
      {
        label: 'Tỷ lệ tiêm chủng (%)',
        data: stats.gradeStats?.map(grade => grade.coveragePercentage) || [65, 75, 70, 80, 85, 90, 78],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Generate time-series data for vaccination progress
  const monthlyProgressData = {
    labels: stats.monthlyStats?.map(month => month.month) || ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        label: 'Số học sinh được tiêm chủng',
        data: stats.monthlyStats?.map(month => month.vaccinationCount) || [120, 150, 180, 250, 310, 350],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ],
  };
  
  // Export report as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Báo cáo tiêm chủng học đường', 20, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 20, 30);
    
    // Add summary
    doc.setFontSize(12);
    doc.text('Tóm tắt báo cáo', 20, 40);
    doc.setFontSize(10);
    doc.text(`Tỷ lệ bao phủ tiêm chủng toàn trường: ${stats.coveragePercentage || 0}%`, 20, 50);
    doc.text(`Tổng số học sinh đã tiêm đầy đủ: ${stats.fullyVaccinated || 0}`, 20, 60);
    doc.text(`Tổng số học sinh chưa tiêm đầy đủ: ${stats.partiallyVaccinated || 0}`, 20, 70);
    doc.text(`Tổng số học sinh chưa tiêm: ${stats.notVaccinated || 0}`, 20, 80);
    
    // Add vaccination data table
    const tableData = stats.vaccineStats?.map(vaccine => [
      vaccine.vaccineName,
      vaccine.totalEligible,
      vaccine.totalVaccinated,
      `${vaccine.percentage}%`,
    ]) || [];
    
    doc.autoTable({
      startY: 90,
      head: [['Vaccine', 'Học sinh hợp lệ', 'Học sinh đã tiêm', 'Tỷ lệ']],
      body: tableData,
    });
    
    doc.save('bao-cao-tiem-chung.pdf');
  };
  
  // Export data as Excel
  const exportAsExcel = () => {
    // Prepare data for Excel export
    const worksheet = XLSX.utils.json_to_sheet([
      { A: 'Báo cáo tiêm chủng học đường', B: '', C: '', D: '', E: '' },
      { A: `Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`, B: '', C: '', D: '', E: '' },
      { A: '', B: '', C: '', D: '', E: '' },
      { A: 'Tóm tắt', B: '', C: '', D: '', E: '' },
      { A: 'Tỷ lệ bao phủ tiêm chủng toàn trường:', B: `${stats.coveragePercentage || 0}%`, C: '', D: '', E: '' },
      { A: 'Tổng số học sinh đã tiêm đầy đủ:', B: stats.fullyVaccinated || 0, C: '', D: '', E: '' },
      { A: 'Tổng số học sinh chưa tiêm đầy đủ:', B: stats.partiallyVaccinated || 0, C: '', D: '', E: '' },
      { A: 'Tổng số học sinh chưa tiêm:', B: stats.notVaccinated || 0, C: '', D: '', E: '' },
      { A: '', B: '', C: '', D: '', E: '' },
      { A: 'Chi tiết theo loại vaccine', B: '', C: '', D: '', E: '' },
      { A: 'Vaccine', B: 'Học sinh hợp lệ', C: 'Học sinh đã tiêm', D: 'Tỷ lệ', E: 'Ghi chú' },
    ]);
    
    // Add vaccine stats data
    if (stats.vaccineStats && stats.vaccineStats.length > 0) {
      stats.vaccineStats.forEach((vaccine, index) => {
        XLSX.utils.sheet_add_json(
          worksheet, 
          [{ 
            A: vaccine.vaccineName, 
            B: vaccine.totalEligible,
            C: vaccine.totalVaccinated, 
            D: `${vaccine.percentage}%`, 
            E: vaccine.percentage < 70 ? 'Cần cải thiện' : 'Đạt yêu cầu'
          }], 
          { skipHeader: true, origin: 11 + index }
        );
      });
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo tiêm chủng');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'bao-cao-tiem-chung.xlsx');
  };

  return (
    <div className="vaccination-reports">
      <div className="header-actions">
        <h3>Thống kê & Báo cáo Tiêm chủng</h3>
        <div className="export-buttons">
          <button className="btn-export" onClick={exportAsPDF}>
            <i className="fas fa-file-pdf"></i> Xuất PDF
          </button>
          <button className="btn-export" onClick={exportAsExcel}>
            <i className="fas fa-file-excel"></i> Xuất Excel
          </button>
        </div>
      </div>

      <div className="report-filters">
        <div className="filter-row">
          <div className="filter-item">
            <label>Thời gian:</label>
            <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý gần nhất</option>
              <option value="year">Năm học 2024-2025</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Khối lớp:</label>
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
              <option value="all">Tất cả khối</option>
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Loại báo cáo:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="coverage">Tỷ lệ bao phủ</option>
              <option value="progress">Tiến độ tiêm chủng</option>
              <option value="compliance">Tuân thủ tiêm chủng</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>Vaccine:</label>
            <select value={vaccineFilter} onChange={(e) => setVaccineFilter(e.target.value)}>
              <option value="all">Tất cả vaccine</option>
              <option value="BCG">BCG</option>
              <option value="HepB">Viêm gan B</option>
              <option value="OPV">Bại liệt</option>
              <option value="DTP">Bạch hầu - Uốn ván - Ho gà</option>
              <option value="Hib">Hib</option>
            </select>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h4>Tỷ lệ tiêm chủng theo trạng thái</h4>
          <div className="chart-container">
            <Pie data={coverageData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${context.label}: ${value} học sinh (${percentage}%)`;
                    }
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="report-card">
          <h4>Tỷ lệ tiêm chủng theo khối lớp</h4>
          <div className="chart-container">
            <Bar data={gradeData} options={{
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
      
      <div className="report-card full-width">
        <h4>Tiến độ tiêm chủng theo thời gian</h4>
        <div className="chart-container">
          <Line data={monthlyProgressData} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Số học sinh được tiêm chủng'
                }
              }
            }
          }} />
        </div>
      </div>

      <div className="report-summary">
        <h4>Tóm tắt báo cáo</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Tỷ lệ bao phủ toàn trường:</span>
            <span className="summary-value">{stats.coveragePercentage || 0}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Học sinh đã tiêm đầy đủ:</span>
            <span className="summary-value">{stats.fullyVaccinated || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Học sinh chưa tiêm đầy đủ:</span>
            <span className="summary-value">{stats.partiallyVaccinated || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Học sinh chưa tiêm:</span>
            <span className="summary-value">{stats.notVaccinated || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tổng số mũi tiêm đã thực hiện:</span>
            <span className="summary-value">{stats.totalDosesAdministered || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tỷ lệ tuân thủ lịch tiêm:</span>
            <span className="summary-value">{stats.complianceRate || 0}%</span>
          </div>
        </div>
      </div>
      
      <div className="detailed-table">
        <h4>Tỷ lệ tiêm chủng theo loại vaccine</h4>
        <div className="table-container">
          <table className="vaccine-table">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Mã</th>
                <th>Học sinh cần tiêm</th>
                <th>Đã tiêm</th>
                <th>Tỷ lệ (%)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.vaccineStats ? stats.vaccineStats.map((vaccine, index) => (
                <tr key={`vaccine-stat-${index}`}>
                  <td>{vaccine.vaccineName}</td>
                  <td>{vaccine.vaccineCode}</td>
                  <td>{vaccine.totalEligible}</td>
                  <td>{vaccine.totalVaccinated}</td>
                  <td>{vaccine.percentage}%</td>
                  <td>
                    <span className={`status-badge ${vaccine.percentage < 70 ? 'warning' : 'success'}`}>
                      {vaccine.percentage < 70 ? 'Cần cải thiện' : 'Đạt yêu cầu'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="no-data">Không có dữ liệu vaccine</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VaccinationReports;