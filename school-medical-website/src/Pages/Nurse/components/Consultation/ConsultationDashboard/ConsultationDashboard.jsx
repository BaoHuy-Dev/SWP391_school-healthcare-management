import React, { useState, useEffect } from 'react';
import { getConsultationStats } from '../../../../../services/consultationService';
import './ConsultationDashboard.css';

const ConsultationDashboard = ({ onNavigateToList }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getConsultationStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching consultation stats:", err);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="consultation-dashboard">
        <div className="dashboard-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultation-dashboard">
        <div className="dashboard-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="consultation-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Hỗ trợ Tư vấn</h2>
        <button className="btn btn-primary" onClick={onNavigateToList}>
          <i className="fas fa-list btn-icon"></i>
          Xem danh sách tư vấn
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card total-consultations">
          <div className="stat-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="stat-content">
            <h3>Tổng số tư vấn</h3>
            <p className="stat-number">{stats?.total || 0}</p>
          </div>
        </div>

        <div className="stat-card unread-consultations">
          <div className="stat-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content">
            <h3>Chưa đọc</h3>
            <p className="stat-number">{stats?.unread || 0}</p>
          </div>
        </div>

        <div className="stat-card replied-consultations">
          <div className="stat-icon">
            <i className="fas fa-reply"></i>
          </div>
          <div className="stat-content">
            <h3>Đã phản hồi</h3>
            <p className="stat-number">{stats?.replied || 0}</p>
          </div>
        </div>

        <div className="stat-card needs-reply-consultations">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Cần phản hồi</h3>
            <p className="stat-number">{stats?.requiresResponse || 0}</p>
          </div>
        </div>
      </div>      <div className="alert-cards-container">
        <div className="alert-card urgent-card">
          <div className="alert-card-header">
            <div className="alert-icon-wrapper">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3>Phản hồi gấp</h3>
          </div>
          
          <div className="alert-card-body">
            <div className="alert-count-container">
              <div className="alert-count-circle">
                <span className="alert-count-number">{stats?.urgent || 0}</span>
              </div>
              <span className="alert-count-label">Tư vấn cần phản hồi gấp</span>
            </div>
            
            <div className="alert-info">
              <p className="alert-description">
                <i className="fas fa-info-circle"></i>
                Các tư vấn cần phản hồi trong vòng 2 ngày tới
              </p>
              <button 
                className="alert-action-button"
                onClick={() => onNavigateToList('urgent')}
              >
                <i className="fas fa-eye"></i>
                Xem các tư vấn gấp
              </button>
            </div>
          </div>
        </div>

        <div className="alert-card overdue-card">
          <div className="alert-card-header">
            <div className="alert-icon-wrapper">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Quá hạn</h3>
          </div>
          
          <div className="alert-card-body">
            <div className="alert-count-container">
              <div className="alert-count-circle">
                <span className="alert-count-number">{stats?.overdue || 0}</span>
              </div>
              <span className="alert-count-label">Tư vấn đã quá hạn phản hồi</span>
            </div>
            
            <div className="alert-info">
              <p className="alert-description">
                <i className="fas fa-info-circle"></i>
                Các tư vấn đã quá thời hạn phản hồi
              </p>
              <button 
                className="alert-action-button"
                onClick={() => onNavigateToList('overdue')}
              >
                <i className="fas fa-eye"></i>
                Xem các tư vấn quá hạn
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Thao tác nhanh</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => onNavigateToList('unread')}>
            <i className="fas fa-envelope"></i>
            <span>Tư vấn chưa đọc</span>
          </button>
          <button className="action-btn" onClick={() => onNavigateToList('requires-response')}>
            <i className="fas fa-reply-all"></i>
            <span>Cần phản hồi</span>
          </button>
          <button className="action-btn" onClick={() => onNavigateToList()}>
            <i className="fas fa-list-ul"></i>
            <span>Tất cả tư vấn</span>
          </button>
          <button className="action-btn create" onClick={() => window.location.href = "#create"}>
            <i className="fas fa-plus-circle"></i>
            <span>Tạo tư vấn mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDashboard;
