import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentProfile.css";

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Giả lập API call tới backend
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Thay đổi URL API thực tế sau này
        // const response = await fetch('https://api.example.com/student/profile');
        // const data = await response.json();

        // Dữ liệu mẫu để hiển thị
        const mockData = {
          id: "SV001",
          fullName: "Nguyễn Văn An",
          gender: "Nam",
          birthYear: "2010",
          father: "Nguyễn Văn Thanh",
          mother: "Trần Thị Cúc",
          address: "123 Đường Lê Lợi, Phường Sài Gòn, TP.HCM",
          className: "6A1",
          schoolName: "THCS Nguyễn Đình Chiểu",
          healthStatus: "Khỏe mạnh, có tiền sử dị ứng hải sản",
          // Thêm URL avatar (có thể sử dụng placeholder hoặc URL thực)
          avatar: "https://i.pravatar.cc/150?img=11", // Sử dụng dịch vụ avatar tạm thời
        };

        // Đợi 1 giây để giả lập thời gian tải
        setTimeout(() => {
          setStudentData(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Không thể tải thông tin học sinh. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin học sinh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <div className="student-profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <h1>Hồ sơ học sinh</h1>
            <p className="student-id">Mã học sinh: {studentData.id}</p>
          </div>
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img src={studentData.avatar} alt={studentData.fullName} />
            </div>
            <div
              className="avatar-edit-button"
              title="Thay đổi ảnh đại diện"
            >
              <i className="fas fa-camera"></i>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Giữ nguyên phần thông tin cơ bản */}
          <div className="profile-section basic-info">
            <h2>Thông tin cơ bản</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Họ tên học sinh:</span>
                <span className="info-value">{studentData.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Giới tính:</span>
                <span className="info-value">{studentData.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Năm sinh:</span>
                <span className="info-value">{studentData.birthYear}</span>
              </div>
            </div>
          </div>

          {/* Giữ nguyên phần thông tin gia đình */}
          <div className="profile-section family-info">
            <h2>Thông tin gia đình</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Cha:</span>
                <span className="info-value">{studentData.father}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mẹ:</span>
                <span className="info-value">{studentData.mother}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Địa chỉ:</span>
                <span className="info-value">{studentData.address}</span>
              </div>
            </div>
          </div>

          {/* Cập nhật phần thông tin học tập để giống với thông tin gia đình */}
          <div className="profile-section family-info">
            <h2>Thông tin học tập</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Lớp:</span>
                <span className="info-value">{studentData.className}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Trường:</span>
                <span className="info-value">{studentData.schoolName}</span>
              </div>
            </div>
          </div>

          {/* Phần thông tin sức khỏe với icon chỉnh sửa */}
          <div className="profile-section health-info">
            <div className="section-header-with-action">
              <h2>Thông tin sức khỏe</h2>
              <Link
                to="/medical-records"
                className="edit-medical-record"
                title="Xem hồ sơ bệnh án"
              >
                <i className="fas fa-file-medical"></i>
              </Link>
            </div>
            <div className="info-grid single-column">
              <div className="info-item">
                <span className="info-label">Tình trạng sức khỏe:</span>
                <span className="info-value health-status">
                  {studentData.healthStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-button primary">
            <i className="fas fa-edit"></i> Cập nhật thông tin
          </button>
          <button className="action-button secondary">
            <i className="fas fa-print"></i> In hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}
