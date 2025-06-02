import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import healthCheckupService from '../../../../../services/healthCheckupService';
import { useAuth } from '../../../../../context/AuthContext';
import './CheckupList.css';

const CheckupList = ({ campaigns, onCampaignSelect, refreshData }) => {
  // Lấy thông tin người dùng từ context
  const { currentUser } = useAuth();
  
  // State cho form thêm/sửa đợt khám
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' hoặc 'edit'
  const [formData, setFormData] = useState({
    name: '',
    type: 'Toàn trường',
    targetGrades: '',
    targetClasses: '',
    scheduledDate: '',
    endDate: '',
    checkupItems: [],
    description: '',
    status: 'Chưa bắt đầu',
    createdBy: currentUser?.name || 'Y tá trường'
  });
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
    // Cập nhật dữ liệu lọc khi campaigns thay đổi
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      applyFilters();
    } else {
      setFilteredCampaigns([]);
    }
  }, [campaigns, filterStatus, searchTerm]);
  
  // Xử lý lọc dữ liệu
  const applyFilters = () => {
    let filtered = [...campaigns];
    
    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filterStatus);
    }
    
    // Lọc theo từ khoá tìm kiếm
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(term) || 
        campaign.description?.toLowerCase().includes(term) ||
        campaign.targetGrades.toLowerCase().includes(term) ||
        campaign.targetClasses.toLowerCase().includes(term)
      );
    }
    
    // Sắp xếp theo ngày gần nhất
    filtered = filtered.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
    
    setFilteredCampaigns(filtered);
  };
  
  // Khởi tạo form mới
  const initNewForm = () => {
    return {
      name: '',
      type: 'Toàn trường',
      targetGrades: '',
      targetClasses: '',
      scheduledDate: '',
      endDate: '',
      checkupItems: [],
      description: '',
      status: 'Chưa bắt đầu',
      createdBy: currentUser?.name || 'Y tá trường'
    };
  };
  
  // Mở form tạo mới
  const handleAddNew = () => {
    setFormMode('add');
    setFormData(initNewForm());
    setFormErrors({}); // Xóa lỗi trước khi mở form
    setShowForm(true);
  };
    // Mở form chỉnh sửa
  const handleEdit = (campaign) => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      // Đảm bảo định dạng ngày phù hợp với input type="date"
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormMode('edit');
    setFormData({
      ...campaign,
      scheduledDate: formatDate(campaign.scheduledDate),
      endDate: formatDate(campaign.endDate),
      // Đảm bảo checkupItems luôn là array
      checkupItems: campaign.checkupItems || []
    });
    setFormErrors({}); // Xóa lỗi trước khi mở form
    setShowForm(true);
  };
  
  // Xử lý thay đổi input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa thông báo lỗi khi người dùng sửa
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Xử lý thay đổi các checkbox hạng mục khám
  const handleCheckupItemChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          checkupItems: [...prev.checkupItems, value]
        };
      } else {
        return {
          ...prev,
          checkupItems: prev.checkupItems.filter(item => item !== value)
        };
      }
    });
    
    // Xóa lỗi khi người dùng đã chọn ít nhất một hạng mục
    if (formErrors.checkupItems) {
      setFormErrors(prev => ({
        ...prev,
        checkupItems: undefined
      }));
    }
  };
    
  // Kiểm tra dữ liệu form trước khi submit
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['name', 'scheduledDate', 'endDate', 'targetGrades', 'targetClasses'];
    
    // Kiểm tra các trường bắt buộc
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Vui lòng điền thông tin này';
      }
    });
    
    // Kiểm tra ngày hợp lệ nếu cả hai đã được nhập
    if (formData.scheduledDate && formData.endDate) {
      const startDate = new Date(formData.scheduledDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    
    // Kiểm tra hạng mục khám
    if (formData.checkupItems.length === 0) {
      errors.checkupItems = 'Vui lòng chọn ít nhất một hạng mục khám';
    }
    
    // Cập nhật state lỗi
    setFormErrors(errors);
    
    // Form hợp lệ nếu không có lỗi
    return Object.keys(errors).length === 0;
  };
    // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (formMode === 'add') {
        await healthCheckupService.createCheckupCampaign(formData);
        setShowForm(false);
        // Hiển thị thông báo thành công với toast hoặc alert tùy theo ứng dụng đã có sẵn
        alert("Thêm đợt khám mới thành công!");
      } else {
        await healthCheckupService.updateCheckupCampaign(formData.id, formData);
        setShowForm(false);
        alert("Cập nhật đợt khám thành công!");
      }
      
      refreshData(); // Làm mới dữ liệu
    } catch (error) {
      console.error("Error saving campaign:", error);
      // Hiển thị lỗi ở dạng validation error trong form
      setFormErrors({
        ...formErrors,
        form: `Có lỗi xảy ra khi lưu đợt khám: ${error.message || 'Vui lòng thử lại'}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Xoá đợt khám
  const handleDelete = async (campaign) => {
    // Bảo vệ khỏi xóa nhầm với nhiều thông tin hơn
    const confirmMessage = `Bạn có chắc chắn muốn xoá đợt khám "${campaign.name}"?\n\nThông tin đợt khám:\n- Thời gian: ${new Date(campaign.scheduledDate).toLocaleDateString('vi-VN')} đến ${new Date(campaign.endDate).toLocaleDateString('vi-VN')}\n- Trạng thái: ${campaign.status}\n\nLưu ý: Hành động này không thể hoàn tác!`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await healthCheckupService.deleteCheckupCampaign(campaign.id);
        alert("Xóa đợt khám thành công!");
        refreshData(); // Làm mới dữ liệu
      } catch (error) {
        console.error("Error deleting campaign:", error);
        alert(`Có lỗi xảy ra khi xoá đợt khám: ${error.message || 'Vui lòng thử lại'}`);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Cập nhật trạng thái đợt khám
  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      setLoading(true);
      await healthCheckupService.updateCheckupCampaignStatus(campaignId, newStatus);
      alert(`Cập nhật trạng thái thành: ${newStatus}`);
      refreshData(); // Làm mới dữ liệu
    } catch (error) {
      console.error("Error updating campaign status:", error);
      alert(`Có lỗi xảy ra khi cập nhật trạng thái: ${error.message || 'Vui lòng thử lại'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Hiển thị màu sắc theo trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đang diễn ra':
        return 'status-active';
      case 'Sắp diễn ra':
      case 'Chưa bắt đầu':
        return 'status-upcoming';
      case 'Đã hoàn thành':
        return 'status-completed';
      case 'Huỷ':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  // Format và hiển thị ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="checkup-list-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
      <div className="checkup-list-header">
        <h2>Danh sách đợt khám sức khoẻ</h2>
        <div className="controls">
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Tìm kiếm đợt khám..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Huỷ">Đã huỷ</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
            </select>
          </div>
          <button className="add-btn" onClick={handleAddNew}>
            <i className="fas fa-plus"></i> Thêm đợt khám mới
          </button>
        </div>
      </div>

      {/* Bảng danh sách đợt khám */}
      <div className="table-container">
        <table className="checkup-table">
          <thead>
            <tr>
              <th>Tên đợt khám</th>
              <th>Loại đợt khám</th>
              <th>Mục tiêu</th>
              <th>Ngày khám</th>
              <th>Tiến độ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <div className="campaign-name" onClick={() => onCampaignSelect(campaign)}>
                      {campaign.name}
                      <span className="view-details">Xem chi tiết</span>
                    </div>
                    <div className="campaign-description">{campaign.description}</div>
                  </td>
                  <td>{campaign.type}</td>
                  <td>
                    <div>Khối: {campaign.targetGrades}</div>
                    <div>Lớp: {campaign.targetClasses}</div>
                  </td>
                  <td>
                    <div>Bắt đầu: {formatDate(campaign.scheduledDate)}</div>
                    <div>Kết thúc: {formatDate(campaign.endDate)}</div>
                  </td>
                  <td>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${Math.round((campaign.completedStudents / (campaign.totalStudents || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {campaign.completedStudents}/{campaign.totalStudents || 0} 
                      ({Math.round((campaign.completedStudents / (campaign.totalStudents || 1)) * 100)}%)
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(campaign)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(campaign)}>
                        <i className="fas fa-trash"></i>
                      </button>
                      <div className="status-dropdown">
                        <button className="action-btn status-btn">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <div className="status-dropdown-content">
                          <button onClick={() => handleStatusChange(campaign.id, 'Chưa bắt đầu')}>Chưa bắt đầu</button>
                          <button onClick={() => handleStatusChange(campaign.id, 'Sắp diễn ra')}>Sắp diễn ra</button>
                          <button onClick={() => handleStatusChange(campaign.id, 'Đang diễn ra')}>Đang diễn ra</button>
                          <button onClick={() => handleStatusChange(campaign.id, 'Đã hoàn thành')}>Đã hoàn thành</button>
                          <button onClick={() => handleStatusChange(campaign.id, 'Huỷ')}>Huỷ đợt khám</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-message">
                  {searchTerm || filterStatus !== 'all' 
                    ? "Không tìm thấy đợt khám nào phù hợp với bộ lọc."
                    : "Chưa có đợt khám nào được tạo. Nhấn 'Thêm đợt khám mới' để bắt đầu."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        {/* Form thêm/chỉnh sửa đợt khám - hiển thị trực tiếp trên trang */}
      {showForm && (
        <div className="checkup-form-container">
          <div className="checkup-form-header">
            <h3>{formMode === 'add' ? 'Thêm đợt khám mới' : 'Chỉnh sửa đợt khám'}</h3>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
            <Form onSubmit={handleSubmit} className="checkup-form">
            {formErrors.form && (
              <div className="alert alert-danger mb-3" role="alert">
                {formErrors.form}
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>
                Tên đợt khám <span className="required-field">*</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.name}
                placeholder="Nhập tên đợt khám (ví dụ: Khám sức khoẻ định kỳ đầu năm học 2025-2026)"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại đợt khám</Form.Label>
                  <Form.Select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange}
                  >
                    <option value="Toàn trường">Toàn trường</option>
                    <option value="Theo khối">Theo khối</option>
                    <option value="Theo lớp">Theo lớp</option>
                    <option value="Định kỳ học kỳ">Định kỳ học kỳ</option>
                    <option value="Định kỳ quý">Định kỳ quý</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Khối lớp <span className="required-field">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    name="targetGrades"
                    placeholder="Ví dụ: 10, 11, 12 hoặc Tất cả" 
                    value={formData.targetGrades} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.targetGrades}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.targetGrades}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>
                Các lớp áp dụng <span className="required-field">*</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                name="targetClasses"
                placeholder="Ví dụ: 10A1, 10A2 hoặc Tất cả" 
                value={formData.targetClasses} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.targetClasses}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.targetClasses}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Ngày bắt đầu <span className="required-field">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="scheduledDate"
                    value={formData.scheduledDate} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.scheduledDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.scheduledDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Ngày kết thúc <span className="required-field">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="endDate"
                    value={formData.endDate} 
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>
                Các hạng mục khám <span className="required-field">*</span>
              </Form.Label>
              {formErrors.checkupItems && (
                <div className="text-danger mb-2 small">{formErrors.checkupItems}</div>
              )}
              <div className="checkup-items-container">
                <Row>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Chiều cao" 
                      value="Chiều cao"
                      checked={formData.checkupItems.includes('Chiều cao')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Cân nặng" 
                      value="Cân nặng"
                      checked={formData.checkupItems.includes('Cân nặng')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="BMI" 
                      value="BMI"
                      checked={formData.checkupItems.includes('BMI')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Thị lực" 
                      value="Thị lực"
                      checked={formData.checkupItems.includes('Thị lực')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Thính lực" 
                      value="Thính lực"
                      checked={formData.checkupItems.includes('Thính lực')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Huyết áp" 
                      value="Huyết áp"
                      checked={formData.checkupItems.includes('Huyết áp')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Nhịp tim" 
                      value="Nhịp tim"
                      checked={formData.checkupItems.includes('Nhịp tim')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Tình trạng răng" 
                      value="Tình trạng răng"
                      checked={formData.checkupItems.includes('Tình trạng răng')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check 
                      type="checkbox" 
                      label="Kiểm tra mắt chuyên sâu" 
                      value="Kiểm tra mắt chuyên sâu"
                      checked={formData.checkupItems.includes('Kiểm tra mắt chuyên sâu')}
                      onChange={handleCheckupItemChange}
                      isInvalid={!!formErrors.checkupItems}
                    />
                  </Col>
                </Row>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description"
                placeholder="Mô tả chi tiết về đợt khám sức khoẻ"
                value={formData.description} 
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="form-note small text-muted mb-3">
              <span className="required-field">*</span> Thông tin bắt buộc
            </div>
            
            <div className="form-buttons">
              <Button variant="secondary" onClick={() => setShowForm(false)} className="me-2">
                Huỷ
              </Button>
              <Button variant="primary" type="submit">
                {formMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CheckupList;
