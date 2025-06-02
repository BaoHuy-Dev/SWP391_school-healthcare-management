import React, { useState, useEffect } from 'react';
import { 
  getAllStudents,
  getClassList
} from '../../../../../services/studentRecordsService';
import './HealthReports.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Đăng ký components của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HealthReports = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('class');
  const [selectedClass, setSelectedClass] = useState('');
  
  useEffect(() => {
    // Lấy dữ liệu cho báo cáo
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
        
        const classesList = await getClassList();
        setClasses(classesList);
        
        // Mặc định chọn lớp đầu tiên nếu có
        if (classesList.length > 0) {
          setSelectedClass(classesList[0]);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi lấy dữ liệu: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Xử lý khi thay đổi loại báo cáo
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  // Xử lý khi thay đổi lớp
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Lọc học sinh theo lớp đã chọn
  const getStudentsByClass = () => {
    if (!selectedClass) return [];
    return students.filter(student => student.class === selectedClass);
  };

  // Tính phân phối BMI cho học sinh
  const getBmiDistribution = () => {
    const classStudents = getStudentsByClass();
    
    const underweight = classStudents.filter(student => student.healthIndices.bmi < 18.5).length;
    const normal = classStudents.filter(student => student.healthIndices.bmi >= 18.5 && student.healthIndices.bmi < 25).length;
    const overweight = classStudents.filter(student => student.healthIndices.bmi >= 25 && student.healthIndices.bmi < 30).length;
    const obese = classStudents.filter(student => student.healthIndices.bmi >= 30).length;
    
    return {
      labels: ['Gầy', 'Bình thường', 'Thừa cân', 'Béo phì'],
      datasets: [
        {
          data: [underweight, normal, overweight, obese],
          backgroundColor: ['#FFA500', '#4CAF50', '#FF9800', '#F44336'],
        },
      ],
    };
  };

  // Tính phân phối vấn đề sức khỏe
  const getHealthIssuesDistribution = () => {
    const classStudents = getStudentsByClass();
    
    const allergies = classStudents.filter(student => 
      student.medicalHistory.allergies && 
      student.medicalHistory.allergies.toLowerCase() !== 'không').length;
    
    const chronicDiseases = classStudents.filter(student => 
      student.medicalHistory.chronicDiseases && 
      student.medicalHistory.chronicDiseases.toLowerCase() !== 'không').length;
    
    const visionProblems = classStudents.filter(student => {
      const vision = student.healthIndices.vision;
      // Giả định thị lực dưới 8/10 là có vấn đề
      return vision && Number(vision.split('/')[0]) < 8;
    }).length;
    
    const hearingProblems = classStudents.filter(student => 
      student.healthIndices.hearing && 
      student.healthIndices.hearing.toLowerCase() !== 'bình thường').length;
    
    return {
      labels: ['Dị ứng', 'Bệnh mãn tính', 'Thị lực kém', 'Thính lực kém'],
      datasets: [
        {
          label: 'Số học sinh',
          data: [allergies, chronicDiseases, visionProblems, hearingProblems],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Tính phân phối nhóm máu
  const getBloodTypeDistribution = () => {
    const classStudents = getStudentsByClass();
    const bloodTypes = {};
    
    classStudents.forEach(student => {
      const type = student.bloodType;
      if (type) {
        if (bloodTypes[type]) {
          bloodTypes[type]++;
        } else {
          bloodTypes[type] = 1;
        }
      }
    });
    
    const labels = Object.keys(bloodTypes);
    const data = Object.values(bloodTypes);
    
    // Tạo màu ngẫu nhiên cho các nhóm máu
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    };
    
    const backgroundColor = labels.map(() => getRandomColor());
    
    return {
      labels,
      datasets: [
        {
          label: 'Số học sinh',
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };
  // Xuất báo cáo Excel
  const exportToExcel = async () => {
    try {
      const classStudents = getStudentsByClass();
      
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');
      
      // Tạo workbook mới
      const workbook = XLSX.utils.book_new();
      
      // Tạo worksheet cho danh sách học sinh
      const studentWorksheet = XLSX.utils.json_to_sheet(classStudents.map(student => ({
        'Mã học sinh': student.id,
        'Họ và tên': student.name,
        'Lớp': student.class,
        'Ngày sinh': new Date(student.dateOfBirth).toLocaleDateString('vi-VN'),
        'Giới tính': student.gender,
        'Nhóm máu': student.bloodType,
        'Chiều cao (cm)': student.healthIndices.height,
        'Cân nặng (kg)': student.healthIndices.weight,
        'BMI': student.healthIndices.bmi,
        'Thị lực': student.healthIndices.vision,
        'Thính lực': student.healthIndices.hearing,
        'Huyết áp': student.healthIndices.bloodPressure,
        'Dị ứng': student.medicalHistory.allergies,
        'Bệnh mãn tính': student.medicalHistory.chronicDiseases,
        'Trạng thái hồ sơ': student.status
      })));
      
      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, studentWorksheet, 'Danh sách học sinh');
    
      // Tạo một worksheet cho thống kê
      const statsData = [
        {
          'Chỉ số': 'Tổng số học sinh',
          'Giá trị': classStudents.length
        },
        {
          'Chỉ số': 'Số học sinh đã hoàn thành khám',
          'Giá trị': classStudents.filter(s => s.status === 'Đã hoàn thành').length
        },
        {
          'Chỉ số': 'Số học sinh chưa hoàn thành khám',
          'Giá trị': classStudents.filter(s => s.status === 'Chưa hoàn thành').length
        },
        {
          'Chỉ số': 'BMI trung bình',
          'Giá trị': (classStudents.reduce((sum, s) => sum + s.healthIndices.bmi, 0) / classStudents.length).toFixed(2)
        },
        {
          'Chỉ số': 'Chiều cao trung bình (cm)',
          'Giá trị': (classStudents.reduce((sum, s) => sum + s.healthIndices.height, 0) / classStudents.length).toFixed(1)
        },
        {
          'Chỉ số': 'Cân nặng trung bình (kg)',
          'Giá trị': (classStudents.reduce((sum, s) => sum + s.healthIndices.weight, 0) / classStudents.length).toFixed(1)
        }
      ];
      
      const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Thống kê');
      
      // Tạo worksheet cho phân loại BMI
      const bmiData = [
        { 'Phân loại': 'Gầy', 'Số học sinh': classStudents.filter(student => student.healthIndices.bmi < 18.5).length },
        { 'Phân loại': 'Bình thường', 'Số học sinh': classStudents.filter(student => student.healthIndices.bmi >= 18.5 && student.healthIndices.bmi < 25).length },
        { 'Phân loại': 'Thừa cân', 'Số học sinh': classStudents.filter(student => student.healthIndices.bmi >= 25 && student.healthIndices.bmi < 30).length },
        { 'Phân loại': 'Béo phì', 'Số học sinh': classStudents.filter(student => student.healthIndices.bmi >= 30).length }
      ];
      
      const bmiWorksheet = XLSX.utils.json_to_sheet(bmiData);
      XLSX.utils.book_append_sheet(workbook, bmiWorksheet, 'Phân loại BMI');
      
      // Xuất file Excel
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileName = `Bao_cao_suc_khoe_${selectedClass || 'tat_ca'}_${new Date().toLocaleDateString('vi-VN')}.xlsx`;
      
      // Tạo file và tải xuống
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
      const handleExportFile = async () => {
        const FileSaver = await import('file-saver');
        FileSaver.saveAs(blob, fileName);
      };
      
      handleExportFile();
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo Excel. Vui lòng thử lại sau.");
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // Lấy dữ liệu cho báo cáo đã chọn
  let chartData = {};
  let chartOptions = {};
  
  if (reportType === 'class') {
    chartData = getBmiDistribution();
    chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Phân loại BMI - Lớp ${selectedClass}`,
        },
      },
    };
  } else if (reportType === 'health') {
    chartData = getHealthIssuesDistribution();
    chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Thống kê vấn đề sức khỏe - Lớp ${selectedClass}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  } else if (reportType === 'blood') {
    chartData = getBloodTypeDistribution();
    chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Phân bố nhóm máu - Lớp ${selectedClass}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  return (
    <div className="health-reports-container">
      <div className="reports-header">
        <h2>Báo cáo sức khỏe học sinh</h2>
        <div className="reports-actions">
          <button onClick={exportToExcel} className="export-excel-button">
            <i className="fas fa-file-excel"></i>
            Xuất báo cáo Excel
          </button>
        </div>
      </div>
      
      <div className="report-filters">
        <div className="filter-group">
          <label>Chọn lớp:</label>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="filter-select"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Loại báo cáo:</label>
          <select
            value={reportType}
            onChange={handleReportTypeChange}
            className="filter-select"
          >
            <option value="class">Phân loại BMI</option>
            <option value="health">Vấn đề sức khỏe</option>
            <option value="blood">Nhóm máu</option>
          </select>
        </div>
      </div>
      
      <div className="report-content">
        <div className="chart-container">
          {reportType === 'class' ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
        
        <div className="report-summary">
          <h3>Tổng quan lớp {selectedClass}</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">{getStudentsByClass().length}</div>
                <div className="stat-label">Học sinh</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {getStudentsByClass().filter(s => s.status === 'Đã hoàn thành').length}
                </div>
                <div className="stat-label">Hồ sơ đã hoàn thành</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {getStudentsByClass().filter(s => s.status === 'Chưa hoàn thành').length}
                </div>
                <div className="stat-label">Hồ sơ chưa hoàn thành</div>
              </div>
            </div>
          </div>
          
          <div className="report-details">
            {reportType === 'class' && (
              <div className="bmi-summary">
                <h4>Chi tiết phân loại BMI</h4>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Phân loại</th>
                      <th>Số học sinh</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Gầy', 'Bình thường', 'Thừa cân', 'Béo phì'].map((category, index) => {
                      const count = chartData.datasets[0].data[index];
                      const percentage = (count / getStudentsByClass().length * 100).toFixed(1);
                      return (
                        <tr key={category}>
                          <td>{category}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {reportType === 'health' && (
              <div className="health-issues-summary">
                <h4>Chi tiết vấn đề sức khỏe</h4>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Vấn đề sức khỏe</th>
                      <th>Số học sinh</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Dị ứng', 'Bệnh mãn tính', 'Thị lực kém', 'Thính lực kém'].map((issue, index) => {
                      const count = chartData.datasets[0].data[index];
                      const percentage = (count / getStudentsByClass().length * 100).toFixed(1);
                      return (
                        <tr key={issue}>
                          <td>{issue}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {reportType === 'blood' && (
              <div className="blood-type-summary">
                <h4>Chi tiết nhóm máu</h4>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Nhóm máu</th>
                      <th>Số học sinh</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.labels.map((type, index) => {
                      const count = chartData.datasets[0].data[index];
                      const percentage = (count / getStudentsByClass().length * 100).toFixed(1);
                      return (
                        <tr key={type}>
                          <td>{type}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReports;
