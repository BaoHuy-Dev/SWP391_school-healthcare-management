import React, { useState } from 'react';
import { 
  calculateBMICategory,
  getBMIStandardByAgeGender,
  addStudentNote
} from '../../../../../services/studentRecordsService';
import './StudentDetail.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jsPDF } from "jspdf";

// Đăng ký components của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StudentDetail = ({ student, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [newNote, setNewNote] = useState('');
  
  // Tính tuổi từ ngày sinh
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Lấy thông tin BMI và phân loại
  const age = calculateAge(student.dateOfBirth);
  const bmiInfo = calculateBMICategory(student.healthIndices.bmi);
  const bmiStandard = getBMIStandardByAgeGender(age, student.gender);

  // Dữ liệu cho biểu đồ BMI
  const bmiChartData = {
    labels: student.healthRecords.map(record => {
      const date = new Date(record.date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }),
    datasets: [
      {
        label: 'Chỉ số BMI',
        data: student.healthRecords.map(record => record.bmi),
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        tension: 0.3,
      },
      {
        label: 'BMI chuẩn thấp',
        data: Array(student.healthRecords.length).fill(bmiStandard.min),
        borderColor: '#ffa726',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      },
      {
        label: 'BMI chuẩn cao',
        data: Array(student.healthRecords.length).fill(bmiStandard.max),
        borderColor: '#ffa726',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // Dữ liệu cho biểu đồ tăng trưởng
  const growthChartData = {
    labels: student.healthRecords.map(record => {
      const date = new Date(record.date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }),
    datasets: [
      {
        label: 'Chiều cao (cm)',
        data: student.healthRecords.map(record => record.height),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'Cân nặng (kg)',
        data: student.healthRecords.map(record => record.weight),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  // Cấu hình biểu đồ tăng trưởng
  const growthChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Chiều cao (cm)'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Cân nặng (kg)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Xử lý khi thêm ghi chú mới
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await addStudentNote(student.id, {
        content: newNote,
        author: "Y tá" // Trong thực tế nên lấy tên người dùng hiện tại
      });
      
      // Cập nhật lại student để hiển thị ghi chú mới
      // Trong thực tế sẽ fetch lại dữ liệu student
      student.notes.push({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        content: newNote,
        author: "Y tá"
      });
      
      setNewNote('');
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm ghi chú: ' + error.message);
    }
  };

  // Xuất báo cáo PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Tiêu đề
    doc.setFontSize(20);
    doc.text("BÁO CÁO SỨC KHỎE HỌC SINH", 105, 20, { align: "center" });
    
    // Thông tin học sinh
    doc.setFontSize(14);
    doc.text("THÔNG TIN CÁ NHÂN", 105, 35, { align: "center" });
    
    doc.setFontSize(12);    doc.text(`Họ và tên: ${student.name}`, 20, 45);
    doc.text(`Mã học sinh: ${student.id}`, 20, 52);
    doc.text(`Lớp: ${student.class}`, 20, 59);
    doc.text(`Giáo viên chủ nhiệm: ${student.homeRoomTeacher || "Chưa cập nhật"}`, 20, 66);
    doc.text(`Ngày sinh: ${new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}`, 20, 73);
    doc.text(`Giới tính: ${student.gender}`, 20, 80);
    doc.text(`Nhóm máu: ${student.bloodType}`, 20, 87);
      // Thông tin sức khỏe
    doc.setFontSize(14);
    doc.text("CHỈ SỐ SỨC KHỎE", 105, 102, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Chiều cao: ${student.healthIndices.height} cm`, 20, 112);
    doc.text(`Cân nặng: ${student.healthIndices.weight} kg`, 20, 119);
    doc.text(`BMI: ${student.healthIndices.bmi} (${bmiInfo.category})`, 20, 126);
    doc.text(`Thị lực: ${student.healthIndices.vision}`, 20, 133);
    doc.text(`Thính lực: ${student.healthIndices.hearing}`, 20, 140);
    doc.text(`Huyết áp: ${student.healthIndices.bloodPressure}`, 20, 147);
      // Tiền sử bệnh
    doc.setFontSize(14);
    doc.text("TIỀN SỬ BỆNH", 105, 162, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Dị ứng: ${student.medicalHistory.allergies || "Không"}`, 20, 172);
    doc.text(`Bệnh mãn tính: ${student.medicalHistory.chronicDiseases || "Không"}`, 20, 179);
    doc.text(`Tiền sử y tế: ${student.medicalHistory.medicalHistory || "Không"}`, 20, 186);
    
    // Ngày tạo báo cáo
    doc.setFontSize(10);
    doc.text(`Báo cáo được tạo vào ngày ${new Date().toLocaleDateString('vi-VN')}`, 105, 240, { align: "center" });
    doc.text("Trường THCS & THPT ABC", 105, 250, { align: "center" });
    
    // Lưu PDF
    doc.save(`Báo_cáo_sức_khỏe_${student.name}_${student.id}.pdf`);
  };

  return (
    <div className="student-detail-container">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Quay lại danh sách
        </button>
        <div className="header-actions">
          <button onClick={onEdit} className="edit-button">
            <i className="fas fa-edit"></i>
            Chỉnh sửa hồ sơ
          </button>
          <button onClick={generatePDF} className="export-button">
            <i className="fas fa-file-pdf"></i>
            Xuất PDF
          </button>
        </div>
      </div>
        <div className="student-profile-header">
        <div className="student-avatar">
          <img src={student.imageUrl || student.avatar || "https://via.placeholder.com/150"} alt={student.name} />
        </div>
        <div className="student-basic-info">
          <h2>{student.name}</h2>
          <div className="info-badges">
            <span className="badge badge-id">
              <i className="fas fa-id-card"></i> {student.id}
            </span>
            <span className="badge badge-class">
              <i className="fas fa-school"></i> {student.class}
            </span>
            <span className="badge badge-blood">
              <i className="fas fa-tint"></i> {student.bloodType}
            </span>
            <span className={`badge badge-status ${student.status === 'Đã hoàn thành' ? 'status-complete' : 'status-incomplete'}`}>
              {student.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="detail-tabs">
        <div 
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <i className="fas fa-user"></i>
          Thông tin cá nhân
        </div>
        <div 
          className={`tab ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <i className="fas fa-heartbeat"></i>
          Chỉ số sức khỏe
        </div>
        <div 
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          <i className="fas fa-notes-medical"></i>
          Tiền sử bệnh
        </div>
        <div 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <i className="fas fa-clipboard"></i>
          Ghi chú
        </div>
      </div>
      
      <div className="tab-content">
        {/* Tab Thông tin cá nhân */}
        {activeTab === 'personal' && (
          <div className="personal-info-content">
            <div className="info-section">
              <h3>Thông tin cơ bản</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Họ và tên</span>
                  <span className="info-value">{student.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mã học sinh</span>
                  <span className="info-value">{student.id}</span>
                </div>                <div className="info-item">
                  <span className="info-label">Lớp</span>
                  <span className="info-value">{student.class}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giáo viên chủ nhiệm</span>
                  <span className="info-value">{student.homeRoomTeacher || "Chưa cập nhật"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giới tính</span>
                  <span className="info-value">{student.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày sinh</span>
                  <span className="info-value">{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tuổi</span>
                  <span className="info-value">{calculateAge(student.dateOfBirth)} tuổi</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nhóm máu</span>
                  <span className="info-value">{student.bloodType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cập nhật gần nhất</span>
                  <span className="info-value">{new Date(student.lastUpdated).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <h3>Thông tin liên hệ khẩn cấp</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Họ tên phụ huynh</span>
                  <span className="info-value">{student.emergencyContact.parentName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số điện thoại</span>
                  <span className="info-value">{student.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tab Chỉ số sức khỏe */}
        {activeTab === 'health' && (
          <div className="health-indices-content">
            <div className="health-section">
              <h3>Chỉ số sức khỏe hiện tại</h3>
              <div className="health-grid">
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-ruler-vertical"></i>
                    <h4>Chiều cao</h4>
                  </div>
                  <div className="health-item-value">{student.healthIndices.height} cm</div>
                </div>
                
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-weight"></i>
                    <h4>Cân nặng</h4>
                  </div>
                  <div className="health-item-value">{student.healthIndices.weight} kg</div>
                </div>
                
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-calculator"></i>
                    <h4>BMI</h4>
                  </div>
                  <div className="health-item-value" style={{ color: bmiInfo.color }}>
                    {student.healthIndices.bmi}
                    <span className="health-item-description">{bmiInfo.category}</span>
                  </div>
                  <div className="health-item-standard">
                    <small>Chuẩn độ tuổi: {bmiStandard.min} - {bmiStandard.max}</small>
                  </div>
                </div>
                
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-eye"></i>
                    <h4>Thị lực</h4>
                  </div>
                  <div className="health-item-value">{student.healthIndices.vision}</div>
                </div>
                
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-deaf"></i>
                    <h4>Thính lực</h4>
                  </div>
                  <div className="health-item-value">{student.healthIndices.hearing}</div>
                </div>
                
                <div className="health-item">
                  <div className="health-item-header">
                    <i className="fas fa-heart"></i>
                    <h4>Huyết áp</h4>
                  </div>
                  <div className="health-item-value">{student.healthIndices.bloodPressure}</div>
                </div>
              </div>
            </div>
            
            <div className="charts-container">
              <div className="chart-section">
                <h3>Biểu đồ BMI theo thời gian</h3>
                <div className="chart-wrapper">
                  <Line data={bmiChartData} />
                </div>
              </div>
              
              <div className="chart-section">
                <h3>Biểu đồ tăng trưởng</h3>
                <div className="chart-wrapper">
                  <Line data={growthChartData} options={growthChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tab Tiền sử bệnh */}
        {activeTab === 'medical' && (
          <div className="medical-history-content">
            <div className="medical-section">
              <h3>Dị ứng</h3>
              <div className="medical-text">
                {student.medicalHistory.allergies || "Không có dị ứng"}
              </div>
            </div>
            
            <div className="medical-section">
              <h3>Bệnh mãn tính</h3>
              <div className="medical-text">
                {student.medicalHistory.chronicDiseases || "Không có bệnh mãn tính"}
              </div>
            </div>
            
            <div className="medical-section">
              <h3>Tiền sử y tế</h3>
              <div className="medical-text">
                {student.medicalHistory.medicalHistory || "Không có tiền sử y tế đáng chú ý"}
              </div>
            </div>
          </div>
        )}
        
        {/* Tab Ghi chú */}
        {activeTab === 'notes' && (
          <div className="notes-content">
            <div className="add-note-section">
              <h3>Thêm ghi chú mới</h3>
              <div className="note-input-container">
                <textarea 
                  className="note-input"
                  placeholder="Nhập ghi chú mới về tình trạng sức khỏe học sinh..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <button 
                  className="add-note-button"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                >
                  <i className="fas fa-plus"></i>
                  Thêm ghi chú
                </button>
              </div>
            </div>
            
            <div className="notes-list-section">
              <h3>Lịch sử ghi chú</h3>
              {student.notes && student.notes.length > 0 ? (
                <div className="notes-list">
                  {student.notes.slice().reverse().map((note) => (
                    <div key={note.id} className="note-item">
                      <div className="note-header">
                        <div className="note-author">{note.author}</div>
                        <div className="note-date">{new Date(note.date).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <div className="note-content">{note.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-notes">
                  <i className="fas fa-clipboard"></i>
                  <p>Chưa có ghi chú nào cho học sinh này.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
