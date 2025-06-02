import React, { useState, useEffect } from 'react';
import vaccinationService from '../../../../../services/vaccinationService';
import './VaccinationRecordManagement.css';

const VaccinationRecordManagement = ({ refreshData }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [students, setStudents] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 10;
  
  // Form data for adding/editing records
  const [formData, setFormData] = useState({
    studentId: '',
    vaccineId: '',
    dose: 1,
    dateAdministered: '',
    administrator: '',
    status: 'Hoàn thành',
    sideEffects: '',
    notes: '',
    consented: true
  });
  
  // For validation
  const [formErrors, setFormErrors] = useState({});
  
  // Filters
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch records, students and vaccines in parallel
      const [recordsData, studentsData, vaccinesData] = await Promise.all([
        vaccinationService.getAllVaccinationRecords(),
        vaccinationService.getAllStudents(),
        vaccinationService.getAllVaccines()
      ]);
      
      console.log('Records data fetched:', recordsData);
      console.log('Students data fetched:', studentsData);
      console.log('Vaccines data fetched:', vaccinesData);
      
      if (!vaccinesData || vaccinesData.length === 0) {
        console.error('Vaccines data is empty or undefined');
      }
      
      if (!studentsData || studentsData.length === 0) {
        console.error('Students data is empty or undefined');
      }
      
      setRecords(recordsData || []);
      setTotalRecords(recordsData ? recordsData.length : 0);
      setStudents(studentsData || []);
      setVaccines(vaccinesData || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      // Set empty arrays as fallback
      setRecords([]);
      setTotalRecords(0);
      setStudents([]);
      setVaccines([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter change handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filteredRecords = await vaccinationService.searchVaccinationRecords(filters);
      setRecords(filteredRecords);
      setTotalRecords(filteredRecords.length);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      status: '',
      fromDate: '',
      toDate: ''
    });
    fetchInitialData();
  };

  // Form handling
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error for the field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    // If student changes, update student info
    if (name === 'studentId') {
      const selectedStudent = students.find(s => s.id === parseInt(value));
      if (selectedStudent) {
        setFormData(prev => ({
          ...prev,
          studentId: value,
          studentName: selectedStudent.name,
          studentCode: selectedStudent.studentCode,
          className: selectedStudent.className
        }));
      }
    }
    
    // If vaccine changes, update vaccine info
    if (name === 'vaccineId') {
      const selectedVaccine = vaccines.find(v => v.id === parseInt(value));
      if (selectedVaccine) {
        setFormData(prev => ({
          ...prev,
          vaccineId: value,
          vaccineName: selectedVaccine.name,
          vaccineCode: selectedVaccine.code
        }));
      }
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.studentId) errors.studentId = "Vui lòng chọn học sinh";
    if (!formData.vaccineId) errors.vaccineId = "Vui lòng chọn vaccine";
    if (!formData.dose || formData.dose < 1) errors.dose = "Mũi tiêm phải lớn hơn 0";
    
    if (formData.status === 'Hoàn thành') {
      if (!formData.dateAdministered) errors.dateAdministered = "Vui lòng chọn ngày tiêm";
      if (!formData.administrator) errors.administrator = "Vui lòng nhập người tiêm";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (modalType === 'add') {
        // Add new record
        await vaccinationService.addVaccinationRecord(formData);
      } else if (modalType === 'edit') {
        // Update existing record
        await vaccinationService.updateVaccinationRecord(selectedRecord.id, formData);
      }
      
      // Refresh records and close modal
      fetchInitialData();
      if (refreshData) await refreshData();
      setShowModal(false);
      
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Có lỗi xảy ra khi lưu bản ghi.");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setModalType('add');
    setSelectedRecord(null);
    setFormData({
      studentId: '',
      vaccineId: '',
      dose: 1,
      dateAdministered: new Date().toISOString().split('T')[0], // Today's date
      administrator: '',
      status: 'Hoàn thành',
      sideEffects: '',
      notes: '',
      consented: true
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleViewRecord = (record) => {
    setModalType('view');
    setSelectedRecord(record);
    setFormData({
      ...record,
      dateAdministered: record.dateAdministered ? new Date(record.dateAdministered).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleEditRecord = (record) => {
    setModalType('edit');
    setSelectedRecord(record);
    setFormData({
      ...record,
      studentId: record.studentId.toString(),
      vaccineId: record.vaccineId.toString(),
      dateAdministered: record.dateAdministered ? new Date(record.dateAdministered).toISOString().split('T')[0] : ''
    });
    setFormErrors({});
    setShowModal(true);
  };
  
  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(newPage);
    }
  };
  
  const getCurrentRecords = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return records.slice(startIndex, startIndex + recordsPerPage);
  };
  
  // Helper functions
  const getStatusClass = (status) => {
    status = status.toLowerCase();
    if (status.includes('hoàn thành')) return 'completed';
    if (status.includes('dự kiến')) return 'scheduled';
    if (status.includes('hoãn')) return 'postponed';
    if (status.includes('từ chối')) return 'rejected';
    return '';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="vaccination-record-management">
      <div className="section-header">
        <div className="header-title">
          <h2>Ghi nhận Tiêm chủng</h2>
          <p className="subtitle">Quản lý việc tiêm chủng cho học sinh</p>
        </div>
        <button className="btn-primary add-record" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Thêm mũi tiêm mới
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="keyword">Tìm kiếm:</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Tên học sinh, mã..."
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="status">Trạng thái:</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Dự kiến">Dự kiến</option>
              <option value="Hoãn lại">Hoãn lại</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="fromDate">Từ ngày:</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="toDate">Đến ngày:</label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-actions">
            <button className="btn filter-btn" onClick={handleSearch}>
              <i className="fas fa-search"></i> Tìm kiếm
            </button>
            <button className="btn reset-btn" onClick={handleReset}>
              <i className="fas fa-undo"></i> Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Records summary */}
      <div className="records-summary">
        <div className="summary-card total">
          <div className="summary-icon">
            <i className="fas fa-syringe"></i>
          </div>
          <div className="summary-info">
            <h3>{totalRecords}</h3>
            <p>Tổng số mũi tiêm</p>
          </div>
        </div>
        
        <div className="summary-card completed">
          <div className="summary-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="summary-info">
            <h3>{records.filter(r => r.status === 'Hoàn thành').length}</h3>
            <p>Đã tiêm</p>
          </div>
        </div>
        
        <div className="summary-card scheduled">
          <div className="summary-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="summary-info">
            <h3>{records.filter(r => r.status === 'Dự kiến').length}</h3>
            <p>Dự kiến</p>
          </div>
        </div>
        
        <div className="summary-card other">
          <div className="summary-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="summary-info">
            <h3>{records.filter(r => r.status !== 'Hoàn thành' && r.status !== 'Dự kiến').length}</h3>
            <p>Hoãn/Từ chối</p>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {loading && !showModal ? (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu tiêm chủng...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table records-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Học sinh</th>
                <th>Lớp</th>
                <th>Vaccine</th>
                <th>Mũi số</th>
                <th>Ngày tiêm</th>
                <th>Trạng thái</th>
                <th>Người thực hiện</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentRecords().length > 0 ? (
                getCurrentRecords().map((record, index) => (
                  <tr key={record.id} className={`status-${getStatusClass(record.status)}`}>
                    <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                    <td>
                      {record.studentName}
                      <div className="record-code">{record.studentCode}</div>
                    </td>
                    <td>{record.className}</td>
                    <td>
                      {record.vaccineName}
                      <div className="record-code">{record.vaccineCode}</div>
                    </td>
                    <td className="dose-cell">{record.dose}</td>
                    <td>
                      {formatDate(record.dateAdministered)}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.administrator || '—'}</td>
                    <td className="actions">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => handleViewRecord(record)}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEditRecord(record)}
                        title="Cập nhật"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-table">
                    Không tìm thấy bản ghi tiêm chủng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalRecords > 0 && (
            <div className="pagination">
              <button 
                className="page-btn first" 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button 
                className="page-btn prev" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-angle-left"></i>
              </button>
              <span className="page-info">Trang {currentPage} / {Math.ceil(totalRecords / recordsPerPage)}</span>
              <button 
                className="page-btn next" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button 
                className="page-btn last" 
                onClick={() => handlePageChange(Math.ceil(totalRecords / recordsPerPage))}
                disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal for Add/Edit/View Record */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {modalType === 'add' ? 'Thêm mũi tiêm mới' : 
                 modalType === 'edit' ? 'Cập nhật mũi tiêm' : 
                 'Chi tiết mũi tiêm'}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">                  <div className="form-group">
                    <label htmlFor="studentId">Học sinh:</label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleFormChange}
                      disabled={modalType === 'view'}
                      className={formErrors.studentId ? 'error' : ''}
                    >
                      <option value="">-- Chọn học sinh --</option>
                      {Array.isArray(students) && students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.studentCode || 'N/A'} ({student.className || 'N/A'})
                        </option>
                      ))}
                    </select>
                    {formErrors.studentId && <div className="error-message">{formErrors.studentId}</div>}
                  </div>
                    <div className="form-group">
                    <label htmlFor="vaccineId">Vaccine:</label>
                    <select
                      id="vaccineId"
                      name="vaccineId"
                      value={formData.vaccineId}
                      onChange={handleFormChange}
                      disabled={modalType === 'view'}
                      className={formErrors.vaccineId ? 'error' : ''}
                    >
                      <option value="">-- Chọn vaccine --</option>
                      {Array.isArray(vaccines) && vaccines.map(vaccine => (
                        <option key={vaccine.id} value={vaccine.id}>
                          {vaccine.name} ({vaccine.code || 'N/A'})
                        </option>
                      ))}
                    </select>
                    {formErrors.vaccineId && <div className="error-message">{formErrors.vaccineId}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dose">Mũi số:</label>
                    <input
                      type="number"
                      id="dose"
                      name="dose"
                      min="1"
                      value={formData.dose}
                      onChange={handleFormChange}
                      disabled={modalType === 'view'}
                      className={formErrors.dose ? 'error' : ''}
                    />
                    {formErrors.dose && <div className="error-message">{formErrors.dose}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status">Trạng thái:</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      disabled={modalType === 'view'}
                    >
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Dự kiến">Dự kiến</option>
                      <option value="Hoãn lại">Hoãn lại</option>
                      <option value="Từ chối">Từ chối</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateAdministered">Ngày tiêm:</label>
                    <input
                      type="date"
                      id="dateAdministered"
                      name="dateAdministered"
                      value={formData.dateAdministered}
                      onChange={handleFormChange}
                      disabled={modalType === 'view' || formData.status === 'Dự kiến'}
                      className={formErrors.dateAdministered ? 'error' : ''}
                    />
                    {formErrors.dateAdministered && (
                      <div className="error-message">{formErrors.dateAdministered}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="administrator">Người tiêm:</label>
                    <input
                      type="text"
                      id="administrator"
                      name="administrator"
                      placeholder="Tên người tiêm"
                      value={formData.administrator || ''}
                      onChange={handleFormChange}
                      disabled={modalType === 'view' || formData.status === 'Dự kiến'}
                      className={formErrors.administrator ? 'error' : ''}
                    />
                    {formErrors.administrator && (
                      <div className="error-message">{formErrors.administrator}</div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="sideEffects">Tác dụng phụ:</label>
                  <input
                    type="text"
                    id="sideEffects"
                    name="sideEffects"
                    placeholder="Ghi nhận tác dụng phụ nếu có"
                    value={formData.sideEffects || ''}
                    onChange={handleFormChange}
                    disabled={modalType === 'view' || formData.status === 'Dự kiến'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Ghi chú:</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    placeholder="Ghi chú về mũi tiêm"
                    value={formData.notes || ''}
                    onChange={handleFormChange}
                    disabled={modalType === 'view'}
                  ></textarea>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="consented"
                    name="consented"
                    checked={formData.consented}
                    onChange={handleFormChange}
                    disabled={modalType === 'view'}
                  />
                  <label htmlFor="consented">Phụ huynh đã đồng ý tiêm chủng</label>
                </div>
                
                {modalType !== 'view' && (
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <i className={modalType === 'add' ? 'fas fa-plus' : 'fas fa-save'}></i>
                      {modalType === 'add' ? ' Thêm mũi tiêm' : ' Cập nhật'}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                      <i className="fas fa-times"></i> Hủy
                    </button>
                  </div>
                )}
                
                {modalType === 'view' && (
                  <div className="form-actions">
                    <button type="button" className="btn btn-edit" onClick={() => {
                      setModalType('edit');
                    }}>
                      <i className="fas fa-edit"></i> Chỉnh sửa
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                      <i className="fas fa-times"></i> Đóng
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationRecordManagement;