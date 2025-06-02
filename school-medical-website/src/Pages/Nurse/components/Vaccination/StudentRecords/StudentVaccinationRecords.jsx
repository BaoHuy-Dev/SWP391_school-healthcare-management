import React, { useState, useEffect } from 'react';
import vaccinationService from '../../../../../services/vaccinationService';
import './StudentVaccinationRecords.css';

const StudentVaccinationRecords = ({ refreshData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [studentRecords, setStudentRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [vaccineStatus, setVaccineStatus] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const studentsPerPage = 10;
  
  // Filters
  const [filters, setFilters] = useState({
    keyword: '',
    className: '',
    grade: '',
    vaccinationStatus: ''
  });
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students and vaccines in parallel
        const [studentsData, vaccinesData] = await Promise.all([
          vaccinationService.getAllStudents(),
          vaccinationService.getAllVaccines()
        ]);
        
        setStudents(studentsData);
        setTotalStudents(studentsData.length);
        setVaccines(vaccinesData);
        
        // Calculate vaccination status for each student
        const statusMap = {};
        await Promise.all(studentsData.map(async (student) => {
          try {
            const records = await vaccinationService.getStudentVaccinationHistory(student.id);
            statusMap[student.id] = calculateVaccinationStatus(records, vaccinesData);
          } catch (error) {
            console.error(`Failed to fetch history for student ${student.id}:`, error);
          }
        }));
        
        setVaccineStatus(statusMap);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate vaccination status based on records and required vaccines
  const calculateVaccinationStatus = (records, allVaccines) => {
    if (!records || records.length === 0) {
      return { status: 'none', label: 'Chưa tiêm chủng', percentage: 0 };
    }
    
    // Get mandatory vaccines
    const mandatoryVaccines = allVaccines.filter(v => v.mandatory).length;
    
    // Count completed mandatory vaccinations
    const completedRecords = records.filter(record => 
      record.status === 'Hoàn thành' && 
      allVaccines.find(v => v.id === record.vaccineId)?.mandatory
    );
    
    const uniqueCompletedVaccines = [...new Set(completedRecords.map(r => r.vaccineId))].length;
    
    const percentage = Math.round((uniqueCompletedVaccines / mandatoryVaccines) * 100);
    
    if (percentage === 100) {
      return { status: 'complete', label: 'Đã hoàn thành', percentage };
    } else if (percentage > 0) {
      return { status: 'partial', label: `Đã tiêm ${percentage}%`, percentage };
    } else {
      return { status: 'none', label: 'Chưa tiêm chủng', percentage: 0 };
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Apply filters
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);
      const filteredStudents = await vaccinationService.searchStudents(filters);
      setStudents(filteredStudents);
      setTotalStudents(filteredStudents.length);
    } catch (error) {
      console.error("Failed to apply filters:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filters
  const handleResetFilters = async () => {
    setFilters({
      keyword: '',
      className: '',
      grade: '',
      vaccinationStatus: ''
    });
    
    try {
      setLoading(true);
      setCurrentPage(1);
      const allStudents = await vaccinationService.getAllStudents();
      setStudents(allStudents);
      setTotalStudents(allStudents.length);
    } catch (error) {
      console.error("Failed to reset filters:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // View student vaccination records
  const handleViewRecords = async (student) => {
    try {
      setLoading(true);
      setSelectedStudent(student);
      
      const records = await vaccinationService.getStudentVaccinationHistory(student.id);
      setStudentRecords(records);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch student vaccination history:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get vaccination status for a student
  const getVaccinationStatus = (studentId) => {
    return vaccineStatus[studentId] || { status: 'unknown', label: 'Đang tải...', percentage: 0 };
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalStudents / studentsPerPage)) {
      setCurrentPage(newPage);
    }
  };
  
  // Get current students for pagination
  const getCurrentStudents = () => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return students.slice(startIndex, startIndex + studentsPerPage);
  };
  
  // Export student vaccination records to PDF or Excel
  const handleExportRecords = async (format) => {
    if (selectedStudent) {
      try {
        setExportLoading(true);
        const exportData = {
          studentName: selectedStudent.name,
          studentId: selectedStudent.studentCode,
          records: studentRecords
        };
        
        const result = await vaccinationService.exportVaccinationReport('student', exportData);
        
        if (result.success) {
          // Create a download link for the user
          const a = document.createElement('a');
          a.href = result.fileUrl;
          a.download = `vaccination_record_${selectedStudent.studentCode}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          alert("Không thể xuất báo cáo: " + result.message);
        }
      } catch (error) {
        console.error("Failed to export records:", error);
        alert("Có lỗi xảy ra khi xuất báo cáo.");
      } finally {
        setExportLoading(false);
      }
    }
  };
  
  return (
    <div className="student-vaccination-records">
      <div className="section-header">
        <div className="header-title">
          <h2>Hồ sơ Tiêm chủng Học sinh</h2>
          <p className="subtitle">Quản lý và theo dõi lịch sử tiêm chủng cho học sinh</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="keyword">Tìm kiếm:</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Nhập mã hoặc tên học sinh..."
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="className">Lớp:</label>
            <input
              type="text"
              id="className"
              name="className"
              placeholder="Ví dụ: 10A1"
              value={filters.className}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="grade">Khối:</label>
            <select
              id="grade"
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả khối</option>
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="vaccinationStatus">Trạng thái:</label>
            <select
              id="vaccinationStatus"
              name="vaccinationStatus"
              value={filters.vaccinationStatus}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="complete">Đã hoàn thành</option>
              <option value="partial">Đã tiêm một phần</option>
              <option value="none">Chưa tiêm chủng</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="btn filter-btn" onClick={handleApplyFilters}>
              <i className="fas fa-filter"></i> Lọc
            </button>
            <button className="btn reset-btn" onClick={handleResetFilters}>
              <i className="fas fa-undo"></i> Đặt lại
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="summary-stats-container">
        <div className="stat-box total">
          <div className="stat-number">{totalStudents}</div>
          <div className="stat-label">Tổng số học sinh</div>
        </div>
        
        <div className="stat-box completed">
          <div className="stat-number">
            {Object.values(vaccineStatus).filter(s => s.status === 'complete').length}
          </div>
          <div className="stat-label">Hoàn thành tiêm chủng</div>
        </div>
        
        <div className="stat-box partial">
          <div className="stat-number">
            {Object.values(vaccineStatus).filter(s => s.status === 'partial').length}
          </div>
          <div className="stat-label">Tiêm chủng một phần</div>
        </div>
        
        <div className="stat-box none">
          <div className="stat-number">
            {Object.values(vaccineStatus).filter(s => s.status === 'none').length}
          </div>
          <div className="stat-label">Chưa tiêm chủng</div>
        </div>
      </div>
      
      {/* Students Table */}
      {loading && !showModal ? (
        <div className="loading-spinner centered">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table student-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã học sinh</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Ngày sinh</th>
                <th>Trạng thái tiêm chủng</th>
                <th>Tiến độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentStudents().length > 0 ? (
                getCurrentStudents().map((student, index) => {
                  const vaccinationStatus = getVaccinationStatus(student.id);
                  
                  return (
                    <tr key={student.id}>
                      <td>{(currentPage - 1) * studentsPerPage + index + 1}</td>
                      <td>{student.studentCode}</td>
                      <td>{student.name}</td>
                      <td>{student.className}</td>
                      <td>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status-badge ${vaccinationStatus.status}`}>
                          {vaccinationStatus.label}
                        </span>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className={`progress-bar ${vaccinationStatus.status}`}
                            style={{ width: `${vaccinationStatus.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="action-cell">
                        <button 
                          className="btn-icon btn-view" 
                          onClick={() => handleViewRecords(student)}
                          title="Xem hồ sơ tiêm chủng"
                        >
                          <i className="fas fa-file-medical"></i> Xem hồ sơ
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table">Không tìm thấy học sinh nào</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalStudents > 0 && (
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
              <span className="page-info">Trang {currentPage} / {Math.ceil(totalStudents / studentsPerPage)}</span>
              <button 
                className="page-btn next" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalStudents / studentsPerPage)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button 
                className="page-btn last" 
                onClick={() => handlePageChange(Math.ceil(totalStudents / studentsPerPage))}
                disabled={currentPage === Math.ceil(totalStudents / studentsPerPage)}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal for Vaccination Records */}
      {showModal && selectedStudent && (
        <div className="modal-backdrop">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Hồ sơ tiêm chủng - {selectedStudent.name}</h3>
              <div className="header-actions">
                <button 
                  className="btn btn-export" 
                  onClick={() => handleExportRecords('pdf')}
                  disabled={exportLoading || studentRecords.length === 0}
                >
                  <i className="fas fa-file-pdf"></i> Xuất PDF
                </button>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="modal-body">
              {/* Student info */}
              <div className="student-info-card">
                <div className="student-info-header">
                  <i className="fas fa-user-graduate student-icon"></i>
                  <div className="student-name-id">
                    <h4>{selectedStudent.name}</h4>
                    <p className="student-code">Mã HS: {selectedStudent.studentCode}</p>
                  </div>
                  <div className="student-class">
                    <span className="class-badge">Lớp {selectedStudent.className}</span>
                  </div>
                </div>
                <div className="student-info-details">
                  <div className="info-item">
                    <span className="info-label"><i className="fas fa-birthday-cake"></i> Ngày sinh:</span>
                    <span className="info-value">
                      {new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><i className="fas fa-venus-mars"></i> Giới tính:</span>
                    <span className="info-value">{selectedStudent.gender === 'M' ? 'Nam' : 'Nữ'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><i className="fas fa-phone"></i> SĐT phụ huynh:</span>
                    <span className="info-value">{selectedStudent.parentPhone || 'Không có'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><i className="fas fa-user"></i> Phụ huynh:</span>
                    <span className="info-value">{selectedStudent.parentName || 'Không có'}</span>
                  </div>
                </div>
              </div>

              {/* Vaccination summary */}
              <div className="records-summary">
                <h4>Tổng quan tiêm chủng</h4>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="stat-number">{studentRecords.length || 0}</div>
                    <div className="stat-label">Tổng số mũi tiêm</div>
                  </div>
                  <div className="summary-stat completed">
                    <div className="stat-number">
                      {studentRecords.filter(record => record.status === 'Hoàn thành').length || 0}
                    </div>
                    <div className="stat-label">Đã tiêm</div>
                  </div>
                  <div className="summary-stat pending">
                    <div className="stat-number">
                      {studentRecords.filter(record => record.status === 'Dự kiến').length || 0}
                    </div>
                    <div className="stat-label">Dự kiến</div>
                  </div>
                  
                  <div className="vaccination-progress">
                    <div className="progress-label">Tiến độ tiêm chủng:</div>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${getVaccinationStatus(selectedStudent.id).status}`}
                        style={{ width: `${getVaccinationStatus(selectedStudent.id).percentage}%` }}
                      ></div>
                      <span className="progress-percentage">{getVaccinationStatus(selectedStudent.id).percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Records table */}
              <div className="vaccination-records-container">
                <div className="records-header">
                  <h4>Chi tiết tiêm chủng</h4>
                </div>
                {studentRecords.length > 0 ? (
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Vaccine</th>
                        <th>Mũi số</th>
                        <th>Ngày tiêm</th>
                        <th>Trạng thái</th>
                        <th>Người tiêm</th>
                        <th>Tác dụng phụ</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRecords.map((record, index) => (
                        <tr key={record.id} className={`status-${record.status.toLowerCase().replace(' ', '-')}`}>
                          <td>{index + 1}</td>
                          <td>
                            {record.vaccineName}
                            <div className="vaccine-code">{record.vaccineCode}</div>
                          </td>
                          <td>{record.dose}</td>
                          <td>
                            {record.dateAdministered 
                              ? new Date(record.dateAdministered).toLocaleDateString('vi-VN') 
                              : 'Chưa tiêm'}
                          </td>
                          <td>
                            <span className={`status-badge ${record.status.toLowerCase().replace(' ', '-')}`}>
                              {record.status}
                            </span>
                          </td>
                          <td>{record.administrator || '—'}</td>
                          <td>{record.sideEffects || 'Không'}</td>
                          <td>
                            <div className="record-notes">{record.notes || '—'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-records">
                    <i className="fas fa-folder-open"></i>
                    <p>Học sinh chưa có bản ghi tiêm chủng nào</p>
                    <button className="btn btn-add-record">
                      Thêm mới bản ghi tiêm chủng
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                <i className="fas fa-check"></i> Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVaccinationRecords;