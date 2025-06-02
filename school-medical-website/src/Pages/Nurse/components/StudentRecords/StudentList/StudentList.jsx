import React, { useState, useEffect } from 'react';
import { 
  getAllStudents,
  searchStudents,
  getClassList,
  getBloodTypes 
} from '../../../../../services/studentRecordsService';
import './StudentList.css';
import StudentDetail from '../StudentDetail/StudentDetail';
import AddEditRecord from '../AddEditRecord/AddEditRecord';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    // State cho tìm kiếm và lọc
  const [keyword, setKeyword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('');
  
  // State cho danh sách lớp và nhóm máu
  const [classes, setClasses] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  
  // State cho xem chi tiết và thêm/sửa hồ sơ
  const [viewMode, setViewMode] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Lấy danh sách học sinh
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        
        // Lấy danh sách lớp và nhóm máu
        const classesList = await getClassList();
        const bloodTypesList = await getBloodTypes();
        
        setClasses(classesList);
        setBloodTypes(bloodTypesList);
        
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi lấy dữ liệu: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  useEffect(() => {
    // Lọc học sinh khi các điều kiện thay đổi
    const filterStudents = async () => {
      try {
        const filteredData = await searchStudents({
          keyword,
          class: selectedClass,
          bloodType: selectedBloodType,
          healthIssue: selectedHealthIssue
        });
        
        setFilteredStudents(filteredData);
      } catch (error) {
        setError('Có lỗi xảy ra khi lọc dữ liệu: ' + error.message);
      }
    };
    
    filterStudents();
  }, [keyword, selectedClass, selectedBloodType, selectedHealthIssue]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    // Đã xử lý tìm kiếm tự động trong useEffect
  };
  // Xử lý khi nhấn nút Reset
  const handleReset = () => {
    setKeyword('');
    setSelectedClass('');
    setSelectedBloodType('');
    setSelectedHealthIssue('');
  };

  // Xử lý khi nhấn vào một học sinh
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewMode('detail');
  };

  // Xử lý khi quay lại danh sách
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedStudent(null);
  };

  // Xử lý khi muốn thêm hồ sơ mới
  const handleAddRecord = () => {
    setViewMode('add');
    setSelectedStudent(null);
  };

  // Xử lý khi muốn chỉnh sửa hồ sơ
  const handleEditRecord = (student) => {
    setSelectedStudent(student);
    setViewMode('edit');
  };

  // Cập nhật danh sách sau khi thêm/sửa
  const handleRecordUpdated = async () => {
    try {
      const updatedStudents = await getAllStudents();
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setViewMode('list');
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật danh sách: ' + error.message);
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // Hiển thị chi tiết học sinh
  if (viewMode === 'detail' && selectedStudent) {
    return (
      <StudentDetail 
        student={selectedStudent} 
        onBack={handleBackToList} 
        onEdit={() => handleEditRecord(selectedStudent)}
      />
    );
  }

  // Hiển thị form thêm/sửa hồ sơ
  if ((viewMode === 'add' || viewMode === 'edit') && (viewMode === 'add' || selectedStudent)) {
    return (
      <AddEditRecord
        student={viewMode === 'edit' ? selectedStudent : null}
        onBack={handleBackToList}
        onSave={handleRecordUpdated}
        students={students}
        mode={viewMode}
      />
    );
  }

  // Hiển thị danh sách học sinh
  return (
    <div className="student-records-container">
      <div className="search-filter-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label>Lớp:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Nhóm máu:</label>
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Vấn đề sức khỏe:</label>
              <input
                type="text"
                placeholder="Dị ứng, bệnh mãn tính..."
                value={selectedHealthIssue}
                onChange={(e) => setSelectedHealthIssue(e.target.value)}
                className="filter-input"
              />
            </div>
  
            
            <button type="button" onClick={handleReset} className="reset-button">
              Đặt lại bộ lọc
            </button>
          </div>
        </form>
      </div>
      
      <div className="student-records-header">
        <h3>Danh sách học sinh ({filteredStudents.length})</h3>
        <button onClick={handleAddRecord} className="add-record-button">
          <i className="fas fa-plus"></i>
          Thêm hồ sơ mới
        </button>
      </div>
      
      <div className="student-table-container">
        <table className="student-table">          <thead>
            <tr>
              <th>Mã học sinh</th>
              <th>Họ và tên</th>
              <th>Lớp/Khối</th>
              <th>Ngày sinh</th>
              <th>Nhóm máu</th>
              <th>Cập nhật gần nhất</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} onClick={() => handleViewStudent(student)}>                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{student.bloodType}</td>
                  <td>{new Date(student.lastUpdated).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudent(student);
                      }} className="action-button view">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecord(student);
                      }} className="action-button edit">
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>                <td colSpan="7" className="no-data">
                  <i className="fas fa-info-circle"></i>                  {keyword || selectedClass || selectedBloodType || selectedHealthIssue
                    ? "Không tìm thấy học sinh phù hợp với điều kiện lọc."
                    : "Chưa có dữ liệu học sinh nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
