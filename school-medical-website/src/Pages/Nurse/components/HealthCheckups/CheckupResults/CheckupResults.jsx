import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import healthCheckupService from '../../../../../services/healthCheckupService';
import './CheckupResults.css';

const CheckupResults = ({ campaign, onStudentSelect, refreshData, healthStandards }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterExamStatus, setFilterExamStatus] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');
  const [classes, setClasses] = useState([]);

  // Lấy danh sách học sinh thuộc đợt khám và phân loại các lớp
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await healthCheckupService.getStudentsByCampaignId(campaign.id);
        
        // Tạo danh sách các lớp độc nhất để lọc
        const uniqueClasses = [...new Set(studentsData.map(student => student.class))].sort();
        setClasses(uniqueClasses);
        
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [campaign.id]);

  // Lọc và tìm kiếm học sinh
  const filteredStudents = students.filter(student => {
    const matchSearchTerm = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.id.toString().includes(searchTerm);
    
    const matchClass = filterClass === 'all' || student.class === filterClass;
    
    const matchExamStatus = filterExamStatus === 'all' || 
      (filterExamStatus === 'examined' && student.examined) ||
      (filterExamStatus === 'not-examined' && !student.examined);
      
    const matchHealth = filterHealth === 'all' || 
      (filterHealth === 'normal' && student.healthStatus === 'Bình thường') ||
      (filterHealth === 'followup' && student.healthStatus === 'Cần theo dõi') ||
      (filterHealth === 'abnormal' && student.healthStatus === 'Bất thường');
    
    return matchSearchTerm && matchClass && matchExamStatus && matchHealth;
  });

  // Mở form khám sức khoẻ cho học sinh
  const handleExamineStudent = (student) => {
    setSelectedStudent(student);
    
    // Nếu học sinh đã có kết quả khám, lấy dữ liệu để hiển thị
    if (student.examined && student.checkupResults) {
      setFormData(student.checkupResults);
    } else {
      // Khởi tạo form trống
      const initialFormData = {
        height: '',
        weight: '',
        bmi: '',
        visionLeft: '',
        visionRight: '',
        hearing: '',
        bloodPressure: '',
        heartRate: '',
        dentalStatus: '',
        notes: '',
        followupRequired: false,
        followupReason: ''
      };
      setFormData(initialFormData);
    }
    
    setShowForm(true);
  };

  // Cập nhật trường dữ liệu form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Tự động tính BMI khi cập nhật chiều cao hoặc cân nặng
    if (name === 'height' || name === 'weight') {
      const height = name === 'height' ? parseFloat(value) : parseFloat(formData.height);
      const weight = name === 'weight' ? parseFloat(value) : parseFloat(formData.weight);
      
      if (height > 0 && weight > 0) {
        // Tính BMI: cân nặng (kg) / (chiều cao (m))^2
        const heightInMeter = height / 100;
        const bmi = (weight / (heightInMeter * heightInMeter)).toFixed(2);
        setFormData(prev => ({ ...prev, bmi }));
      }
    }
  };

  // Lưu kết quả khám
  const handleSaveResults = async (e) => {
    e.preventDefault();
    
    try {
      // Đánh giá tình trạng sức khoẻ dựa trên các tiêu chí
      let healthStatus = 'Bình thường';
      let followupReasons = [];
      
      // Đánh giá BMI
      if (formData.bmi) {
        const bmi = parseFloat(formData.bmi);
        const age = selectedStudent.age;
        
        // Tìm tiêu chuẩn BMI dựa theo độ tuổi
        const bmiStandard = healthStandards?.bmi.find(s => s.age === age);
        
        if (bmiStandard && (bmi < bmiStandard.min || bmi > bmiStandard.max)) {
          healthStatus = 'Cần theo dõi';
          const status = bmi < bmiStandard.min ? 'thấp' : 'cao';
          followupReasons.push(`BMI ${status} (${formData.bmi})`);
        }
      }
      
      // Đánh giá thị lực
      if (formData.visionLeft && formData.visionRight) {
        const visionLeft = parseFloat(formData.visionLeft);
        const visionRight = parseFloat(formData.visionRight);
        
        if (visionLeft < 0.8 || visionRight < 0.8) {
          healthStatus = 'Cần theo dõi';
          followupReasons.push(`Thị lực giảm (T: ${formData.visionLeft}, P: ${formData.visionRight})`);
        }
      }
      
      // Đánh giá huyết áp
      if (formData.bloodPressure) {
        const bloodPressureParts = formData.bloodPressure.split('/');
        if (bloodPressureParts.length === 2) {
          const systolic = parseInt(bloodPressureParts[0]);
          const diastolic = parseInt(bloodPressureParts[1]);
          
          if (systolic > 120 || diastolic > 80 || systolic < 90 || diastolic < 60) {
            healthStatus = 'Cần theo dõi';
            followupReasons.push(`Huyết áp bất thường (${formData.bloodPressure})`);
          }
        }
      }
      
      // Đánh giá nhịp tim
      if (formData.heartRate) {
        const heartRate = parseInt(formData.heartRate);
        const age = selectedStudent.age;
        
        // Phạm vi nhịp tim bình thường theo độ tuổi
        let minRate = 60;
        let maxRate = 100;
        
        if (age < 12) {
          minRate = 70;
          maxRate = 110;
        } else if (age < 18) {
          minRate = 60;
          maxRate = 100;
        }
        
        if (heartRate < minRate || heartRate > maxRate) {
          healthStatus = 'Cần theo dõi';
          followupReasons.push(`Nhịp tim bất thường (${formData.heartRate})`);
        }
      }
      
      // Đánh giá thính lực
      if (formData.hearing && formData.hearing === 'Giảm thính lực') {
        healthStatus = 'Cần theo dõi';
        followupReasons.push('Giảm thính lực');
      }
      
      // Đánh giá tình trạng răng
      if (formData.dentalStatus && formData.dentalStatus !== 'Bình thường') {
        healthStatus = 'Cần theo dõi';
        followupReasons.push(`Vấn đề răng miệng (${formData.dentalStatus})`);
      }
      
      // Nếu được đánh dấu là cần theo dõi thêm
      if (formData.followupRequired && formData.followupReason) {
        healthStatus = 'Cần theo dõi';
        followupReasons.push(formData.followupReason);
      }
      
      // Cập nhật kết quả khám cho học sinh
      const updatedResults = {
        ...formData,
        examinedDate: new Date().toISOString(),
        healthStatus,
        followupReasons: followupReasons.join('; ')
      };
      
      await healthCheckupService.saveStudentCheckupResults(
        campaign.id, 
        selectedStudent.id, 
        updatedResults
      );
      
      setShowForm(false);
      refreshData();
      
      // Cập nhật lại danh sách học sinh
      const updatedStudents = await healthCheckupService.getStudentsByCampaignId(campaign.id);
      setStudents(updatedStudents);
      
    } catch (error) {
      console.error("Error saving checkup results:", error);
      alert("Có lỗi xảy ra khi lưu kết quả khám. Vui lòng thử lại.");
    }
  };

  // Hàm định dạng và hiển thị ngày giờ
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Xác định CSS class dựa trên trạng thái sức khoẻ
  const getHealthStatusClass = (status) => {
    switch (status) {
      case 'Bình thường':
        return 'health-normal';
      case 'Cần theo dõi':
        return 'health-followup';
      case 'Bất thường':
        return 'health-abnormal';
      default:
        return '';
    }
  };

  return (
    <div className="checkup-results-container">
      <div className="campaign-info">
        <h2>{campaign.name}</h2>
        <div className="campaign-details">
          <div className="detail-item">
            <span className="detail-label">Loại đợt khám:</span>
            <span className="detail-value">{campaign.type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Đối tượng:</span>
            <span className="detail-value">Khối {campaign.targetGrades}, {campaign.targetClasses}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Thời gian:</span>
            <span className="detail-value">
              {new Date(campaign.scheduledDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Trạng thái:</span>
            <span className={`status-badge ${campaign.status.toLowerCase().replace(' ', '-')}`}>{campaign.status}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tiến độ:</span>
            <span className="detail-value">
              {campaign.completedStudents}/{campaign.totalStudents} 
              ({Math.round((campaign.completedStudents / campaign.totalStudents) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-item">
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-item">
          <select 
            value={filterClass} 
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả lớp</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-item">
          <select 
            value={filterExamStatus} 
            onChange={(e) => setFilterExamStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái khám</option>
            <option value="examined">Đã khám</option>
            <option value="not-examined">Chưa khám</option>
          </select>
        </div>
        
        <div className="filter-item">
          <select 
            value={filterHealth} 
            onChange={(e) => setFilterHealth(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả tình trạng sức khoẻ</option>
            <option value="normal">Bình thường</option>
            <option value="followup">Cần theo dõi</option>
            <option value="abnormal">Bất thường</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Mã học sinh</th>
                  <th>Họ tên</th>
                  <th>Lớp</th>
                  <th>Ngày sinh</th>
                  <th>Ngày khám</th>
                  <th>Tình trạng sức khoẻ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className={student.examined ? 'examined' : 'not-examined'}>
                      <td>{student.id}</td>
                      <td>
                        <div className="student-name" onClick={() => onStudentSelect(student)}>
                          {student.name}
                          <span className="view-details">Xem chi tiết</span>
                        </div>
                      </td>
                      <td>{student.class}</td>
                      <td>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                      <td>
                        {student.examined 
                          ? formatDateTime(student.checkupResults?.examinedDate)
                          : 'Chưa khám'}
                      </td>
                      <td>
                        {student.examined ? (
                          <span className={`health-status ${getHealthStatusClass(student.healthStatus)}`}>
                            {student.healthStatus}
                          </span>
                        ) : (
                          <span className="health-status health-pending">Chưa khám</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className={`examine-btn ${student.examined ? 'edit' : 'new'}`} 
                          onClick={() => handleExamineStudent(student)}
                        >
                          {student.examined ? (
                            <>
                              <i className="fas fa-edit"></i> Sửa kết quả
                            </>
                          ) : (
                            <>
                              <i className="fas fa-stethoscope"></i> Khám
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      Không tìm thấy học sinh nào phù hợp với điều kiện lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="summary-container">
            <div className="summary-item">
              <span className="summary-label">Tổng số học sinh:</span>
              <span className="summary-value">{students.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Đã khám:</span>
              <span className="summary-value">{students.filter(s => s.examined).length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Chưa khám:</span>
              <span className="summary-value">{students.filter(s => !s.examined).length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Cần theo dõi:</span>
              <span className="summary-value">{students.filter(s => s.healthStatus === 'Cần theo dõi').length}</span>
            </div>
          </div>
        </>
      )}

      {/* Modal form khám sức khoẻ */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedStudent && (
              <>
                Kết quả khám sức khoẻ - {selectedStudent.name} ({selectedStudent.class})
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Form onSubmit={handleSaveResults}>
              <div className="student-info-header">
                <div>
                  <strong>Mã học sinh:</strong> {selectedStudent.id}
                </div>
                <div>
                  <strong>Ngày sinh:</strong> {new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN')}
                </div>
                <div>
                  <strong>Giới tính:</strong> {selectedStudent.gender}
                </div>
              </div>

              <Row className="mt-3">
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chiều cao (cm)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="height"
                      step="0.1"
                      value={formData.height || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cân nặng (kg)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="weight"
                      step="0.1"
                      value={formData.weight || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>BMI</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="bmi"
                      value={formData.bmi || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thị lực mắt trái</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="visionLeft"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.visionLeft || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thị lực mắt phải</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="visionRight"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.visionRight || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thính lực</Form.Label>
                    <Form.Select 
                      name="hearing"
                      value={formData.hearing || ''} 
                      onChange={handleInputChange}
                    >
                      <option value="">-- Chọn --</option>
                      <option value="Bình thường">Bình thường</option>
                      <option value="Giảm thính lực">Giảm thính lực</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Huyết áp (mmHg)</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="bloodPressure"
                      placeholder="120/80"
                      value={formData.bloodPressure || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhịp tim (nhịp/phút)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="heartRate"
                      value={formData.heartRate || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tình trạng răng miệng</Form.Label>
                <Form.Select 
                  name="dentalStatus"
                  value={formData.dentalStatus || ''} 
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn --</option>
                  <option value="Bình thường">Bình thường</option>
                  <option value="Sâu răng">Sâu răng</option>
                  <option value="Viêm lợi">Viêm lợi</option>
                  <option value="Mọc răng bất thường">Mọc răng bất thường</option>
                  <option value="Cần can thiệp nha khoa">Cần can thiệp nha khoa</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ghi chú thêm</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="notes"
                  value={formData.notes || ''} 
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  id="followupRequired"
                  label="Học sinh cần được theo dõi thêm"
                  name="followupRequired"
                  checked={formData.followupRequired || false}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {formData.followupRequired && (
                <Form.Group className="mb-3">
                  <Form.Label>Lý do cần theo dõi</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="followupReason"
                    value={formData.followupReason || ''} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={() => setShowForm(false)} className="me-2">
                  Huỷ
                </Button>
                <Button variant="primary" type="submit">
                  Lưu kết quả
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CheckupResults;
