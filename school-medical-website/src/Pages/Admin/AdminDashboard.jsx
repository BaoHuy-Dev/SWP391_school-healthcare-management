import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Quản trị hệ thống Y tế học đường</h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <span>Xin chào, {currentUser?.name}</span>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <ul className="admin-menu">
            <li className="admin-menu-item active">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>
            <li className="admin-menu-item">
              <i className="fas fa-user-md"></i>
              <span>Quản lý Y tá</span>
            </li>
            <li className="admin-menu-item">
              <i className="fas fa-users"></i>
              <span>Quản lý Phụ huynh</span>
            </li>
            <li className="admin-menu-item">
              <i className="fas fa-user-graduate"></i>
              <span>Quản lý Học sinh</span>
            </li>
            <li className="admin-menu-item">
              <i className="fas fa-file-medical"></i>
              <span>Hồ sơ Y tế</span>
            </li>
            <li className="admin-menu-item">
              <i className="fas fa-cog"></i>
              <span>Cài đặt</span>
            </li>
          </ul>
        </aside>

        <main className="admin-content">
          <div className="admin-welcome">
            <h2>Xin chào, {currentUser?.name}!</h2>
            <p>Chào mừng đến với hệ thống quản trị Y tế học đường.</p>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-details">
                <h3>1,245</h3>
                <p>Học sinh</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>950</h3>
                <p>Phụ huynh</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="stat-details">
                <h3>15</h3>
                <p>Y tá</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">
                <i className="fas fa-notes-medical"></i>
              </div>
              <div className="stat-details">
                <h3>352</h3>
                <p>Khám sức khỏe</p>
              </div>
            </div>
          </div>

          <div className="admin-recent">
            <div className="admin-card recent-activities">
              <h3>Hoạt động gần đây</h3>
              <ul className="activity-list">
                <li>
                  <span className="activity-time">09:45</span>
                  <div className="activity-details">
                    <span className="activity-user">Nguyễn Văn A</span>
                    <span className="activity-action">
                      đã cập nhật hồ sơ học sinh
                    </span>
                  </div>
                </li>
                <li>
                  <span className="activity-time">08:30</span>
                  <div className="activity-details">
                    <span className="activity-user">Trần Thị B</span>
                    <span className="activity-action">
                      đã tạo tài khoản mới
                    </span>
                  </div>
                </li>
                <li>
                  <span className="activity-time">Hôm qua</span>
                  <div className="activity-details">
                    <span className="activity-user">Lê Văn C</span>
                    <span className="activity-action">
                      đã cập nhật thông tin liên hệ
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="admin-card system-notifications">
              <h3>Thông báo hệ thống</h3>
              <ul className="notification-list">
                <li className="notification-item urgent">
                  <i className="fas fa-exclamation-circle"></i>
                  <div className="notification-content">
                    <p>Cần cập nhật hồ sơ y tế các học sinh lớp 10A1</p>
                    <span>2 giờ trước</span>
                  </div>
                </li>
                <li className="notification-item">
                  <i className="fas fa-info-circle"></i>
                  <div className="notification-content">
                    <p>Đợt khám sức khỏe định kỳ sẽ bắt đầu vào tuần sau</p>
                    <span>1 ngày trước</span>
                  </div>
                </li>
                <li className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div className="notification-content">
                    <p>Hoàn thành cập nhật dữ liệu năm học mới</p>
                    <span>3 ngày trước</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
