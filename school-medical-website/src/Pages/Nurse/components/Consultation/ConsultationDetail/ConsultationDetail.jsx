import React, { useState, useEffect } from 'react';
import { markConsultationAsRead, addConsultationResponse } from '../../../../../services/consultationService';
import './ConsultationDetail.css';

const ConsultationDetail = ({ consultation, onBack, onConsultationUpdated }) => {
  const [consultationData, setConsultationData] = useState(consultation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [sending, setSending] = useState(false);

  // Mark consultation as read when opened
  useEffect(() => {
    const markAsRead = async () => {
      if (!consultationData.isRead) {
        try {
          const updatedConsultation = await markConsultationAsRead(consultationData.id);
          setConsultationData(updatedConsultation);
        } catch (err) {
          console.error("Error marking consultation as read:", err);
          // Not showing error to user for this operation
        }
      }
    };
    
    markAsRead();
  }, [consultationData.id, consultationData.isRead]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Check if consultation is urgent (deadline within 2 days)
  const isUrgent = () => {
    if (!consultationData.responseDeadline || consultationData.responses.length > 0) return false;
    
    const now = new Date();
    const deadline = new Date(consultationData.responseDeadline);
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    
    return deadline <= twoDaysFromNow && deadline >= now;
  };

  // Check if consultation is overdue
  const isOverdue = () => {
    if (!consultationData.responseDeadline || consultationData.responses.length > 0) return false;
    
    const now = new Date();
    const deadline = new Date(consultationData.responseDeadline);
    
    return deadline < now;
  };

  // Get status badge class
  const getStatusBadgeClass = () => {
    if (consultationData.responses.length > 0) return "status-replied";
    if (isOverdue()) return "status-overdue";
    if (isUrgent()) return "status-urgent";
    if (consultationData.isRead) return "status-read";
    return "status-unread";
  };

  // Get status text
  const getStatusText = () => {
    if (consultationData.responses.length > 0) return "Đã phản hồi";
    if (isOverdue()) return "Quá hạn phản hồi";
    if (isUrgent()) return "Cần phản hồi gấp";
    if (consultationData.isRead) return "Đã đọc";
    return "Chưa đọc";
  };

  // Handle form submission for adding a response
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!responseContent.trim()) {
      setError("Vui lòng nhập nội dung phản hồi");
      return;
    }
    
    try {
      setSending(true);
      setError(null);
      
      // Mock current user (in a real app, this would come from auth context)
      const currentUser = {
        id: "u003",
        name: "Đỗ Thị Hoa",
        role: "Y tá"
      };
      
      const responseData = {
        responder: currentUser,
        content: responseContent
      };
      
      const updatedConsultation = await addConsultationResponse(consultationData.id, responseData);
      setConsultationData(updatedConsultation);
      setResponseContent('');
      onConsultationUpdated(updatedConsultation);
    } catch (err) {
      console.error("Error sending response:", err);
      setError("Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="consultation-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Quay lại danh sách
        </button>
        <div className="detail-status">
          <span className={`status-badge ${getStatusBadgeClass()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="detail-title-section">
          <h2>{consultationData.title}</h2>
          <div className="detail-meta">
            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              {formatDate(consultationData.sendDate)}
            </div>
            {consultationData.responseDeadline && (
              <div className={`meta-item ${isOverdue() ? 'overdue' : isUrgent() ? 'urgent' : ''}`}>
                <i className="fas fa-clock"></i>
                Hạn phản hồi: {formatDate(consultationData.responseDeadline)}
              </div>
            )}
          </div>
        </div>
        
        <div className="detail-info-grid">
          <div className="info-section sender-info">
            <h3>Thông tin người gửi</h3>
            <div className="info-content">
              <div className="info-item">
                <span className="info-label">Người gửi:</span>
                <span className="info-value">{consultationData.sender.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vai trò:</span>
                <span className="info-value">{consultationData.sender.role}</span>
              </div>
            </div>
          </div>
          
          <div className="info-section receiver-info">
            <h3>Thông tin người nhận</h3>
            <div className="info-content">
              <div className="info-item">
                <span className="info-label">Người nhận:</span>
                <span className="info-value">{consultationData.receiver.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vai trò:</span>
                <span className="info-value">{consultationData.receiver.role}</span>
              </div>
            </div>
          </div>
          
          {consultationData.student && (
            <div className="info-section student-info">
              <h3>Học sinh liên quan</h3>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Tên học sinh:</span>
                  <span className="info-value">{consultationData.student.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lớp:</span>
                  <span className="info-value">{consultationData.student.class}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="info-section type-info">
            <h3>Thông tin tư vấn</h3>
            <div className="info-content">
              <div className="info-item">
                <span className="info-label">Loại tư vấn:</span>
                <span className="info-value consultation-type">{consultationData.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Yêu cầu phản hồi:</span>
                <span className="info-value">
                  {consultationData.requireResponse ? 'Có' : 'Không'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="message-content">
          <h3>Nội dung tư vấn</h3>
          <div className="message-body">
            {consultationData.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        {consultationData.responses && consultationData.responses.length > 0 && (
          <div className="responses-section">
            <h3>Lịch sử phản hồi</h3>
            <div className="responses-list">
              {consultationData.responses.map((response) => (
                <div key={response.id} className="response-item">
                  <div className="response-header">
                    <div className="response-author">
                      {response.responder.name} ({response.responder.role})
                    </div>
                    <div className="response-date">
                      {formatDate(response.responseDate)}
                    </div>
                  </div>
                  <div className="response-content">
                    {response.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {consultationData.requireResponse && consultationData.responses.length === 0 && (
          <div className="add-response-section">
            <h3>Thêm phản hồi</h3>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="responseContent" className="form-label">Nội dung phản hồi:</label>
                <textarea 
                  id="responseContent"
                  className="form-control form-textarea"
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  placeholder="Nhập nội dung phản hồi của bạn..."
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary send-response-btn"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="button-spinner"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane btn-icon"></i>
                      Gửi phản hồi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDetail;
