import React, { useState, useEffect } from 'react';
import medicalEventsService from '../../../../services/medicalEventsService';
import './MedicalEventsManagement.css';

const MedicalEventsManagement = () => {
  // States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  
  // State cho form thêm/sửa
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    eventType: '',
    dateTime: '',
    severity: '',
    notifiedParent: false,
    needsFollowUp: false,
    symptoms: '',
    treatment: '',
    medication: '',
    notes: '',
    handledBy: ''
  });
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    studentId: '',
    eventType: '',
    severity: '',
    fromDate: '',
    toDate: '',
    notifiedParent: '',
    needsFollowUp: ''
  });
  
  // Thêm state để theo dõi trạng thái tìm kiếm
  const [searchStatus, setSearchStatus] = useState({
    hasSearched: false,
    resultCount: 0
  });
  
  // Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, typesData, severityData] = await Promise.all([
          medicalEventsService.getAllEvents(),
          medicalEventsService.getEventTypes(),
          medicalEventsService.getSeverityLevels()
        ]);
        
        setEvents(eventsData);
        setEventTypes(typesData);
        setSeverityLevels(severityData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Xử lý mở modal chi tiết
  const handleViewDetails = async (id) => {
    try {
      setLoading(true);
      const eventData = await medicalEventsService.getEventById(id);
      setSelectedEvent(eventData);
      setIsDetailView(true);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý mở form thêm mới
  const handleAddNew = () => {
    setFormData({
      studentId: '',
      studentName: '',
      eventType: eventTypes.length > 0 ? eventTypes[0] : '',
      dateTime: new Date().toISOString().slice(0, 16), // Format YYYY-MM-DDThh:mm
      severity: severityLevels.length > 0 ? severityLevels[0] : '',
      notifiedParent: false,
      needsFollowUp: false,
      symptoms: '',
      treatment: '',
      medication: '',
      notes: '',
      handledBy: ''
    });
    setSelectedEvent(null);
    setIsDetailView(false);
    setShowModal(true);
  };
  
  // Xử lý mở form chỉnh sửa
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const eventData = await medicalEventsService.getEventById(id);
      
      // Convert ISO date to local datetime input format
      const dateTimeLocal = eventData.dateTime ? new Date(eventData.dateTime).toISOString().slice(0, 16) : '';
      
      setFormData({
        ...eventData,
        dateTime: dateTimeLocal
      });
      
      setSelectedEvent(eventData);
      setIsDetailView(false);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý thay đổi form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.studentId || !formData.studentName || !formData.eventType || !formData.dateTime || !formData.severity) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc");
        return;
      }
      
      let result;
      if (selectedEvent) {
        // Cập nhật
        result = await medicalEventsService.updateEvent(selectedEvent.id, formData);
        alert("Cập nhật sự kiện y tế thành công!");
      } else {
        // Thêm mới
        result = await medicalEventsService.addEvent(formData);
        alert("Thêm mới sự kiện y tế thành công!");
      }
      
      // Refresh data
      const updatedEvents = await medicalEventsService.getAllEvents();
      setEvents(updatedEvents);
      
      // Đóng modal
      setShowModal(false);
      
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện y tế:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;
    
    let filterValue = value;
    
    // Xử lý trường hợp đặc biệt
    if (name === 'studentId') {
      // Không làm gì đặc biệt, giữ nguyên giá trị để người dùng có thể nhập tự do
      console.log("StudentID filter changed:", value);
    } else if (name === 'notifiedParent' || name === 'needsFollowUp') {
      // Convert select value to boolean or undefined
      if (value === 'true') filterValue = true;
      else if (value === 'false') filterValue = false;
      else filterValue = ''; // Reset filter
    }
    
    setFilters({
      ...filters,
      [name]: filterValue
    });
  };
  
  // Áp dụng bộ lọc - cập nhật hàm này
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      
      // Tạo bản sao của bộ lọc và làm sạch các giá trị
      const cleanedFilters = { ...filters };
      
      // Gỡ bỏ khoảng trắng thừa từ giá trị studentId
      if (cleanedFilters.studentId) {
        cleanedFilters.studentId = cleanedFilters.studentId.trim();
      }
      
      console.log("Applying filters:", cleanedFilters);
      
      const filteredEvents = await medicalEventsService.searchEvents(cleanedFilters);
      console.log("Filtered results:", filteredEvents);
      
      // Cập nhật trạng thái tìm kiếm
      setSearchStatus({
        hasSearched: true,
        resultCount: filteredEvents.length
      });
      
      setEvents(filteredEvents);
      
      if (filteredEvents.length === 0) {
        alert("Không tìm thấy sự kiện y tế phù hợp với điều kiện lọc.");
      }
    } catch (error) {
      console.error("Lỗi khi lọc sự kiện:", error);
      alert("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  
  // Reset bộ lọc
  const handleResetFilters = async () => {
    // Reset filters
    setFilters({
      studentId: '',
      eventType: '',
      severity: '',
      fromDate: '',
      toDate: '',
      notifiedParent: '',
      needsFollowUp: ''
    });
    
    // Reset search status
    setSearchStatus({
      hasSearched: false,
      resultCount: 0
    });
    
    try {
      setLoading(true);
      const eventsData = await medicalEventsService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
  };
  
  // Get class based on severity
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Nghiêm trọng': return 'severity-high';
      case 'Trung bình': return 'severity-medium';
      case 'Nhẹ': return 'severity-low';
      default: return '';
    }
  };

  return (
    <main className="medical-events-content">
      {/* Bộ lọc */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-item">
            <label>Mã học sinh:</label>
            <input 
              type="text" 
              name="studentId"
              value={filters.studentId}
              onChange={handleFilterChange}
              placeholder="Nhập mã học sinh..."
            />
          </div>
          
          <div className="filter-item">
            <label>Loại sự kiện:</label>
            <select 
              name="eventType"
              value={filters.eventType}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              {eventTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label>Mức độ:</label>
            <select 
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              {severityLevels.map((level, index) => (
                <option key={index} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-item">
            <label>Từ ngày:</label>
            <input 
              type="date" 
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-item">
            <label>Đến ngày:</label>
            <input 
              type="date" 
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-item">
            <label>Thông báo phụ huynh:</label>
            <select 
              name="notifiedParent"
              value={filters.notifiedParent}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="true">Đã thông báo</option>
              <option value="false">Chưa thông báo</option>
            </select>
          </div>
          
          <div className="filter-item">
            <label>Theo dõi tiếp:</label>
            <select 
              name="needsFollowUp"
              value={filters.needsFollowUp}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="true">Cần theo dõi</option>
              <option value="false">Không cần</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button className="filter-btn apply" onClick={handleApplyFilters}>
            <i className="fas fa-search"></i> Lọc
          </button>
          <button className="filter-btn reset" onClick={handleResetFilters}>
            <i className="fas fa-redo"></i> Đặt lại
          </button>
          <button className="add-event-btn" onClick={handleAddNew}>
            <i className="fas fa-plus"></i> Thêm sự kiện
          </button>
        </div>
      </div>
      
      {/* Bảng danh sách sự kiện */}
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã học sinh</th>
                <th>Tên học sinh</th>
                <th>Loại sự kiện</th>
                <th>Ngày giờ</th>
                <th>Mức độ</th>
                <th>Thông báo PH</th>
                <th>Theo dõi tiếp</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td>{event.studentId}</td>
                    <td>{event.studentName}</td>
                    <td>{event.eventType}</td>
                    <td>{formatDateTime(event.dateTime)}</td>
                    <td className={getSeverityClass(event.severity)}>{event.severity}</td>
                    <td className="status-cell">
                      {event.notifiedParent ? 
                        <i className="fas fa-check-circle status-icon notified"></i> : 
                        <i className="fas fa-question-circle status-icon not-notified"></i>
                      }
                    </td>
                    <td className="status-cell">
                      {event.needsFollowUp ? 
                        <i className="fas fa-eye status-icon follow-up"></i> : 
                        <i className="fas fa-check-circle status-icon no-follow-up"></i>
                      }
                    </td>
                    <td className="action-cell">
                      <button 
                        className="btn-view" 
                        onClick={() => handleViewDetails(event.id)}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(event.id)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">Không có dữ liệu sự kiện y tế</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xem chi tiết hoặc thêm/sửa */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {isDetailView ? 'Chi tiết sự kiện y tế' : 
                 (selectedEvent ? 'Chỉnh sửa sự kiện y tế' : 'Thêm mới sự kiện y tế')}
              </h3>
              <button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {isDetailView ? (
                // Chi tiết sự kiện
                <div className="event-details">
                  <div className="detail-header">
                    <div className={`severity-badge ${getSeverityClass(selectedEvent.severity)}`}>
                      {selectedEvent.severity}
                    </div>
                    <div className="event-datetime">
                      {formatDateTime(selectedEvent.dateTime)}
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Thông tin học sinh</h4>
                    <div className="detail-row">
                      <div className="detail-label">Mã học sinh:</div>
                      <div className="detail-value">{selectedEvent.studentId}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Tên học sinh:</div>
                      <div className="detail-value">{selectedEvent.studentName}</div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Thông tin sự kiện</h4>
                    <div className="detail-row">
                      <div className="detail-label">Loại sự kiện:</div>
                      <div className="detail-value">{selectedEvent.eventType}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Triệu chứng:</div>
                      <div className="detail-value">{selectedEvent.symptoms}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Xử lý/Điều trị:</div>
                      <div className="detail-value">{selectedEvent.treatment}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Thuốc đã dùng:</div>
                      <div className="detail-value">{selectedEvent.medication}</div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Ghi chú và theo dõi</h4>
                    <div className="detail-row">
                      <div className="detail-label">Ghi chú:</div>
                      <div className="detail-value">{selectedEvent.notes}</div>
                    </div>
                    <div className="detail-row status-row">
                      <div className="detail-label">Đã thông báo phụ huynh:</div>
                      <div className="detail-value status">
                        {selectedEvent.notifiedParent ? 
                          <><i className="fas fa-check-circle status-icon notified"></i> Đã thông báo</> : 
                          <><i className="fas fa-question-circle status-icon not-notified"></i> Chưa thông báo</>
                        }
                      </div>
                    </div>
                    <div className="detail-row status-row">
                      <div className="detail-label">Cần theo dõi tiếp:</div>
                      <div className="detail-value status">
                        {selectedEvent.needsFollowUp ? 
                          <><i className="fas fa-eye status-icon follow-up"></i> Cần theo dõi</> : 
                          <><i className="fas fa-check-circle status-icon no-follow-up"></i> Không cần theo dõi</>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Thông tin quản lý</h4>
                    <div className="detail-row">
                      <div className="detail-label">Xử lý bởi:</div>
                      <div className="detail-value">{selectedEvent.handledBy}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Ngày tạo:</div>
                      <div className="detail-value">{formatDateTime(selectedEvent.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="detail-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => {
                        setIsDetailView(false);
                        handleEdit(selectedEvent.id);
                      }}
                    >
                      <i className="fas fa-edit"></i> Chỉnh sửa
                    </button>
                    <button 
                      className="btn-close" 
                      onClick={() => setShowModal(false)}
                    >
                      <i className="fas fa-times"></i> Đóng
                    </button>
                  </div>
                </div>
              ) : (
                // Form thêm/sửa
                <form onSubmit={handleSubmit} className="event-form">
                  {/* Thông tin học sinh */}
                  <div className="form-section">
                    <h4>Thông tin học sinh</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="studentId">Mã học sinh <span className="required">*</span></label>
                        <input 
                          type="text" 
                          id="studentId" 
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="studentName">Tên học sinh <span className="required">*</span></label>
                        <input 
                          type="text" 
                          id="studentName" 
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Thông tin sự kiện */}
                  <div className="form-section">
                    <h4>Thông tin sự kiện</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="eventType">Loại sự kiện <span className="required">*</span></label>
                        <select 
                          id="eventType" 
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn loại sự kiện</option>
                          {eventTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="severity">Mức độ <span className="required">*</span></label>
                        <select 
                          id="severity" 
                          name="severity"
                          value={formData.severity}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn mức độ</option>
                          {severityLevels.map((level, index) => (
                            <option key={index} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateTime">Ngày giờ <span className="required">*</span></label>
                        <input 
                          type="datetime-local" 
                          id="dateTime" 
                          name="dateTime"
                          value={formData.dateTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="handledBy">Xử lý bởi <span className="required">*</span></label>
                        <input 
                          type="text" 
                          id="handledBy" 
                          name="handledBy"
                          value={formData.handledBy}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập tên và chức vụ"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="symptoms">Triệu chứng</label>
                      <textarea 
                        id="symptoms" 
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Mô tả các triệu chứng của học sinh"
                      ></textarea>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="treatment">Xử lý/Điều trị</label>
                      <textarea 
                        id="treatment" 
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Mô tả cách xử lý và điều trị"
                      ></textarea>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="medication">Thuốc đã dùng</label>
                      <textarea 
                        id="medication" 
                        name="medication"
                        value={formData.medication}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Liệt kê các thuốc đã sử dụng"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Ghi chú và theo dõi */}
                  <div className="form-section">
                    <h4>Ghi chú và theo dõi</h4>
                    <div className="form-group full-width">
                      <label htmlFor="notes">Ghi chú</label>
                      <textarea 
                        id="notes" 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Thêm ghi chú và hướng dẫn theo dõi nếu có"
                      ></textarea>
                    </div>
                    
                    <div className="form-row checkbox-row">
                      <div className="form-group checkbox-group">
                        <input 
                          type="checkbox" 
                          id="notifiedParent" 
                          name="notifiedParent"
                          checked={formData.notifiedParent}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="notifiedParent">Đã thông báo phụ huynh</label>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <input 
                          type="checkbox" 
                          id="needsFollowUp" 
                          name="needsFollowUp"
                          checked={formData.needsFollowUp}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="needsFollowUp">Cần theo dõi tiếp</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form actions */}
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      <i className="fas fa-times"></i> Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? (
                        <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</>
                      ) : (
                        <><i className="fas fa-save"></i> {selectedEvent ? 'Cập nhật' : 'Lưu'}</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị thông báo tìm kiếm */}
      {searchStatus.hasSearched && (
        <div className={`search-result-message ${searchStatus.resultCount > 0 ? 'success' : 'no-result'}`}>
          {searchStatus.resultCount > 0 
            ? `Tìm thấy ${searchStatus.resultCount} kết quả` 
            : "Không tìm thấy kết quả nào phù hợp"}
        </div>
      )}
    </main>
  );
};

export default MedicalEventsManagement;

