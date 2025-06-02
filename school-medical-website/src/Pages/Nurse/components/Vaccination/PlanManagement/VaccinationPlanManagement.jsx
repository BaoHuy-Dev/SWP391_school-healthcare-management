import React, { useState, useEffect } from 'react';
import vaccinationService from '../../../../../services/vaccinationService';
import './VaccinationPlanManagement.css';

const VaccinationPlanManagement = ({ refreshData }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add, edit, view, delete
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [vaccines, setVaccines] = useState([]);
  const [errors, setErrors] = useState({});
  const [classOptions, setClassOptions] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
    // Form state for creating/editing plans
  const [formData, setFormData] = useState({
    title: '',
    planDate: new Date().toISOString().split('T')[0],
    vaccineId: '',
    targetClass: 'all',
    targetGrade: 'all',
    priority: 'medium',
    description: '',
    status: 'scheduled',
    estimatedStudents: 0
  });
  
  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);
    const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vaccination plans and vaccines in parallel
      const [plansData, vaccinesData, classesData] = await Promise.all([
        vaccinationService.getAllVaccinationPlans(),
        vaccinationService.getAllVaccines(),
        vaccinationService.getClassList()
      ]);
      
      console.log('Vaccines data fetched:', vaccinesData); // Kiểm tra dữ liệu vaccine
      console.log('Classes data fetched:', classesData); // Kiểm tra dữ liệu lớp học
      
      if (!vaccinesData || vaccinesData.length === 0) {
        console.error('Vaccines data is empty');
      }
      
      if (!classesData || classesData.length === 0) {
        console.error('Classes data is empty');
      }
      
      setPlans(plansData);
      setVaccines(vaccinesData || []);
      setClassOptions(classesData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Set empty arrays as fallback if data fetch fails
      setVaccines([]);
      setClassOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add days from previous month
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const totalDaysNeeded = 42; // 6 rows of 7 days
    const remainingDays = totalDaysNeeded - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  const isSelectedDate = (day, month, year) => {
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  };
  
  const getPlansForDay = (day, month, year) => {
    const date = new Date(year, month, day);
    return plans.filter(plan => {
      const planDate = new Date(plan.planDate);
      return planDate.getDate() === date.getDate() && 
             planDate.getMonth() === date.getMonth() && 
             planDate.getFullYear() === date.getFullYear();
    });
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day, month, year) => {
    setSelectedDate(new Date(year, month, day));
  };
  
  const handleAddPlan = () => {
    setModalMode('add');
    setFormData({
      title: '',
      planDate: selectedDate.toISOString().split('T')[0],
      vaccineId: '',
      targetClass: 'all',
      targetGrade: 'all',
      priority: 'medium',
      description: '',
      status: 'scheduled',
      estimatedStudents: 0
    });
    setErrors({});
    setShowModal(true);
  };
  
  const handleEditPlan = (plan) => {
    setModalMode('edit');
    setSelectedPlan(plan);
    setFormData({
      title: plan.title,
      planDate: new Date(plan.planDate).toISOString().split('T')[0],
      vaccineId: plan.vaccineId.toString(),
      targetClass: plan.targetClass || 'all',
      targetGrade: plan.targetGrade || 'all',
      priority: plan.priority || 'medium',
      description: plan.description || '',
      status: plan.status || 'scheduled',
      estimatedStudents: plan.estimatedStudents || 0
    });
    setErrors({});
    setShowModal(true);
  };
  
  const handleViewPlan = (plan) => {
    setModalMode('view');
    setSelectedPlan(plan);
    setFormData({
      title: plan.title,
      planDate: new Date(plan.planDate).toISOString().split('T')[0],
      vaccineId: plan.vaccineId.toString(),
      targetClass: plan.targetClass || 'all',
      targetGrade: plan.targetGrade || 'all',
      priority: plan.priority || 'medium',
      description: plan.description || '',
      status: plan.status || 'scheduled',
      estimatedStudents: plan.estimatedStudents || 0
    });
    setShowModal(true);
  };
  
  const handleDeletePlan = (plan) => {
    setModalMode('delete');
    setSelectedPlan(plan);
    setShowModal(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!formData.planDate) newErrors.planDate = "Vui lòng chọn ngày";
    if (!formData.vaccineId) newErrors.vaccineId = "Vui lòng chọn vaccine";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Add vaccine details to form data
      const selectedVaccine = vaccines.find(v => v.id.toString() === formData.vaccineId);
      const enrichedData = {
        ...formData,
        vaccineName: selectedVaccine?.name,
        vaccineCode: selectedVaccine?.code
      };
      
      if (modalMode === 'add') {
        await vaccinationService.addVaccinationPlan(enrichedData);
      } else if (modalMode === 'edit') {
        await vaccinationService.updateVaccinationPlan(selectedPlan.id, enrichedData);
      }
      
      // Refetch data and close modal
      await fetchData();
      if (refreshData) await refreshData();
      setShowModal(false);
    } catch (error) {
      console.error(`Failed to ${modalMode} vaccination plan:`, error);
      alert(`Có lỗi xảy ra khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} kế hoạch tiêm chủng.`);
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    try {
      setLoading(true);
      await vaccinationService.deleteVaccinationPlan(selectedPlan.id);
      
      // Refetch data and close modal
      await fetchData();
      if (refreshData) await refreshData();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete vaccination plan:", error);
      alert("Có lỗi xảy ra khi xóa kế hoạch tiêm chủng.");
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredPlans = () => {
    let filtered = [...plans];
    
    // Apply class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(plan => 
        plan.targetClass === classFilter || 
        (plan.targetClass === 'all' && plan.targetGrade === classFilter.charAt(0))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }
    
    // Sort by date, then by priority
    return filtered.sort((a, b) => {
      // First sort by date
      const dateA = new Date(a.planDate);
      const dateB = new Date(b.planDate);
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;
      
      // If same date, sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'in_progress': return 'Đang thực hiện';
      case 'scheduled': return 'Dự kiến';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  
  const getVaccineName = (vaccineId) => {
    const vaccine = vaccines.find(v => v.id.toString() === vaccineId.toString());
    return vaccine ? vaccine.name : 'Không xác định';
  };
  
  // Get selected date plans
  const selectedDatePlans = getPlansForDay(
    selectedDate.getDate(),
    selectedDate.getMonth(),
    selectedDate.getFullYear()
  );
  // Debug: Hiển thị giá trị vaccines khi component render
  console.log('Rendering component with vaccines:', vaccines);

  return (
    <div className="vaccination-plan-management">
      <div className="section-header">
        <div className="header-title">
          <h2>Kế hoạch Tiêm chủng</h2>
          <p className="subtitle">Quản lý và lập kế hoạch tiêm chủng cho học sinh</p>
        </div>
        <button className="btn-primary" onClick={handleAddPlan}>
          <i className="fas fa-plus"></i> Thêm kế hoạch
        </button>
      </div>
      
      <div className="plan-tabs">
        <div 
          className={`tab-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <i className="fas fa-calendar-alt"></i> Lịch tiêm chủng
        </div>
        <div 
          className={`tab-item ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <i className="fas fa-list"></i> Danh sách kế hoạch
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : activeTab === 'calendar' ? (
        <>
          {/* Calendar View */}
          <div className="calendar-view">
            <div className="calendar-header">
              <div className="calendar-title">
                {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </div>
              <div className="calendar-nav">
                <button className="calendar-btn" onClick={handlePrevMonth}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="calendar-btn" 
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Hôm nay
                </button>
                <button className="calendar-btn" onClick={handleNextMonth}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            <div className="calendar-grid">
              {/* Weekday headers */}
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                <div key={`weekday-${index}`} className="calendar-weekday">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {generateCalendarDays().map((dayInfo, index) => {
                const dayPlans = getPlansForDay(dayInfo.day, dayInfo.month, dayInfo.year);
                const hasEvents = dayPlans.length > 0;
                const isCurrentDay = isToday(dayInfo.day, dayInfo.month, dayInfo.year);
                const isSelected = isSelectedDate(dayInfo.day, dayInfo.month, dayInfo.year);
                
                return (
                  <div 
                    key={`day-${index}`} 
                    className={`calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${hasEvents ? 'has-events' : ''} ${isCurrentDay ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(dayInfo.day, dayInfo.month, dayInfo.year)}
                  >
                    <div className="day-number">{dayInfo.day}</div>
                    {hasEvents && (
                      <div className="day-events">
                        {dayPlans.slice(0, 3).map((plan, planIndex) => (
                          <div key={`plan-dot-${planIndex}`}>
                            <span className={`event-dot ${plan.priority || 'medium'}`}></span>
                            <span>{plan.title.length > 8 ? plan.title.substring(0, 8) + '...' : plan.title}</span>
                          </div>
                        ))}
                        {dayPlans.length > 3 && <div>+ {dayPlans.length - 3} khác</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Selected Date Plans */}
          <div className="plan-list">
            <div className="plan-list-header">
              <div className="plan-list-title">
                Kế hoạch {selectedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            
            <div className="plan-items">
              {selectedDatePlans.length > 0 ? (
                selectedDatePlans.map(plan => (
                  <div key={plan.id} className="plan-item">
                    <div className="plan-item-header">
                      <div className="plan-item-title">
                        <span className={`plan-priority ${plan.priority}`}></span>
                        {plan.title}
                      </div>
                      <div className="plan-item-actions">
                        <button 
                          className="plan-action-btn"
                          onClick={() => handleViewPlan(plan)}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="plan-action-btn"
                          onClick={() => handleEditPlan(plan)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="plan-action-btn"
                          onClick={() => handleDeletePlan(plan)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="plan-item-details">
                      <div className="plan-detail">
                        <span className="detail-label">Vaccine:</span>
                        <span className="detail-value">{getVaccineName(plan.vaccineId)}</span>
                      </div>
                      <div className="plan-detail">
                        <span className="detail-label">Đối tượng:</span>
                        <span className="detail-value">
                          {plan.targetClass === 'all' ? 'Tất cả các lớp' : `Lớp ${plan.targetClass}`}
                          {plan.targetGrade === 'all' ? '' : `, Khối ${plan.targetGrade}`}
                        </span>
                      </div>
                      <div className="plan-detail">
                        <span className="detail-label">Trạng thái:</span>
                        <span className={`detail-value status-${plan.status}`}>
                          {getStatusLabel(plan.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-plans">
                  <i className="fas fa-calendar-day"></i>
                  <p>Không có kế hoạch nào cho ngày này</p>
                  <button className="btn-outline" onClick={handleAddPlan}>
                    <i className="fas fa-plus"></i> Thêm kế hoạch mới
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* List View */}
          <div className="list-view">
            <div className="list-filters">
              <div className="filter-group">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm kế hoạch..." 
                  className="search-input"
                />
                <select 
                  className="filter-select"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="all">Tất cả lớp</option>
                  {classOptions.map(classItem => (
                    <option key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                <select 
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="scheduled">Dự kiến</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <button className="btn-primary" onClick={handleAddPlan}>
                <i className="fas fa-plus"></i> Thêm kế hoạch
              </button>
            </div>
            
            <div className="plans-table-container">
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Ngày</th>
                    <th>Vaccine</th>
                    <th>Đối tượng</th>
                    <th>Ước tính học sinh</th>
                    <th>Mức độ ưu tiên</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredPlans().length > 0 ? (
                    getFilteredPlans().map(plan => (
                      <tr key={plan.id}>
                        <td>{plan.title}</td>
                        <td>{new Date(plan.planDate).toLocaleDateString('vi-VN')}</td>
                        <td>{getVaccineName(plan.vaccineId)}</td>
                        <td>
                          {plan.targetClass === 'all' ? 'Tất cả các lớp' : `Lớp ${plan.targetClass}`}
                          {plan.targetGrade === 'all' ? '' : `, Khối ${plan.targetGrade}`}
                        </td>
                        <td>{plan.estimatedStudents || 'N/A'}</td>
                        <td>
                          <span className={`priority-badge ${plan.priority}`}>
                            {plan.priority === 'high' ? 'Cao' : plan.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${plan.status}`}>
                            {getStatusLabel(plan.status)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn view" 
                              onClick={() => handleViewPlan(plan)}
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="action-btn edit" 
                              onClick={() => handleEditPlan(plan)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDeletePlan(plan)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-message">
                        Không tìm thấy kế hoạch tiêm chủng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm kế hoạch tiêm chủng mới'}
                {modalMode === 'edit' && 'Chỉnh sửa kế hoạch tiêm chủng'}
                {modalMode === 'view' && 'Chi tiết kế hoạch tiêm chủng'}
                {modalMode === 'delete' && 'Xác nhận xóa kế hoạch'}
              </h3>
              <button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {modalMode === 'delete' ? (
                <div className="delete-confirmation">
                  <i className="fas fa-exclamation-triangle warning-icon"></i>
                  <p>
                    Bạn có chắc chắn muốn xóa kế hoạch tiêm chủng "{selectedPlan?.title}" không?
                    <br />
                    Hành động này không thể hoàn tác.
                  </p>
                  
                  <div className="form-actions">
                    <button 
                      className="btn-cancel" 
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={confirmDelete}
                      disabled={loading}
                    >
                      {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>} Xác nhận xóa
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="plan-form">
                  <div className="form-group">
                    <label htmlFor="title">Tiêu đề kế hoạch <span className="required">*</span></label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      disabled={modalMode === 'view'}
                      className={errors.title ? 'error' : ''}
                      placeholder="Nhập tiêu đề kế hoạch tiêm chủng"
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="planDate">Ngày thực hiện <span className="required">*</span></label>
                      <input
                        type="date"
                        id="planDate"
                        name="planDate"
                        value={formData.planDate}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                        className={errors.planDate ? 'error' : ''}
                      />
                      {errors.planDate && <div className="error-message">{errors.planDate}</div>}
                    </div>
                      <div className="form-group">
                      <label htmlFor="vaccineId">Vaccine <span className="required">*</span></label>
                      <select
                        id="vaccineId"
                        name="vaccineId"
                        value={formData.vaccineId}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                        className={errors.vaccineId ? 'error' : ''}
                      >
                        <option value="">-- Chọn Vaccine --</option>
                        {Array.isArray(vaccines) && vaccines.map(vaccine => (
                          <option key={vaccine.id} value={vaccine.id}>
                            {vaccine.name} ({vaccine.code || 'N/A'})
                          </option>
                        ))}
                      </select>
                      {errors.vaccineId && <div className="error-message">{errors.vaccineId}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="targetGrade">Khối lớp</label>
                      <select
                        id="targetGrade"
                        name="targetGrade"
                        value={formData.targetGrade}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                      >
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
                      <div className="form-group">
                      <label htmlFor="targetClass">Lớp</label>
                      <select
                        id="targetClass"
                        name="targetClass"
                        value={formData.targetClass}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                      >
                        <option value="all">Tất cả lớp</option>
                        {Array.isArray(classOptions) && classOptions.filter(c => 
                          formData.targetGrade === 'all' || 
                          (c && c.name && c.name.startsWith(formData.targetGrade))
                        ).map(classItem => (
                          <option key={classItem.id} value={classItem.name}>
                            {classItem.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="priority">Mức độ ưu tiên</label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                      >
                        <option value="high">Cao</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Thấp</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="status">Trạng thái</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        disabled={modalMode === 'view'}
                      >
                        <option value="scheduled">Dự kiến</option>
                        <option value="in_progress">Đang thực hiện</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="estimatedStudents">Ước tính số học sinh</label>
                    <input
                      type="number"
                      id="estimatedStudents"
                      name="estimatedStudents"
                      value={formData.estimatedStudents}
                      onChange={handleFormChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      placeholder="Số học sinh dự kiến tham gia"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Mô tả chi tiết</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      disabled={modalMode === 'view'}
                      placeholder="Nhập mô tả chi tiết về kế hoạch tiêm chủng (không bắt buộc)"
                      rows="4"
                    ></textarea>
                  </div>
                  
                  {modalMode !== 'view' && (
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit" 
                        className="btn-submit" 
                        disabled={loading}
                      >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : ''} 
                        {modalMode === 'add' ? 'Thêm kế hoạch' : 'Cập nhật'}
                      </button>
                    </div>
                  )}
                  
                  {modalMode === 'view' && (
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => setShowModal(false)}
                      >
                        Đóng
                      </button>
                      <button 
                        type="button"
                        className="btn-primary" 
                        onClick={() => {
                          setModalMode('edit');
                          setErrors({});
                        }}
                      >
                        <i className="fas fa-edit"></i> Chỉnh sửa
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationPlanManagement;
