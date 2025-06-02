import React, { useState, useEffect } from 'react';
import { 
  createConsultation, 
  getUsers, 
  getStudents, 
  getConsultationTypes 
} from '../../../../../services/consultationService';
import './CreateConsultation.css';

const CreateConsultation = ({ onBack, onConsultationCreated }) => {
  // Form state
  const [formData, setFormData] = useState({
    receiver: '',
    receiverObject: null,
    student: '',
    studentObject: null,
    type: '',
    title: '',
    content: '',
    requireResponse: false,
    responseDeadline: ''
  });
  
  // Component state
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Load necessary data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersData, studentsData, typesData] = await Promise.all([
          getUsers(),
          getStudents(),
          getConsultationTypes()
        ]);
        
        setUsers(usersData);
        setStudents(studentsData);
        setConsultationTypes(typesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Không thể tải dữ liệu cần thiết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Special handling for select fields
    if (name === 'receiver') {
      const selectedUser = users.find(user => user.id === value);
      setFormData(prev => ({ ...prev, receiverObject: selectedUser }));
    } else if (name === 'student') {
      const selectedStudent = students.find(student => student.id === value);
      setFormData(prev => ({ ...prev, studentObject: selectedStudent }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.receiver) {
      setError("Vui lòng chọn người nhận");
      return;
    }
    
    if (!formData.type) {
      setError("Vui lòng chọn loại tư vấn");
      return;
    }
    
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    
    if (!formData.content.trim()) {
      setError("Vui lòng nhập nội dung tư vấn");
      return;
    }
    
    if (formData.requireResponse && !formData.responseDeadline) {
      setError("Vui lòng chọn thời hạn phản hồi");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Mock current user (in a real app, this would come from auth context)
      const currentUser = {
        id: "u003",
        name: "Đỗ Thị Hoa",
        role: "Y tá"
      };
      
      const consultationData = {
        sender: currentUser,
        receiver: formData.receiverObject,
        student: formData.studentObject || null,
        type: formData.type,
        title: formData.title,
        content: formData.content,
        requireResponse: formData.requireResponse,
        responseDeadline: formData.requireResponse ? formData.responseDeadline : null
      };
      
      await createConsultation(consultationData);
      
      // Reset form
      setFormData({
        receiver: '',
        receiverObject: null,
        student: '',
        studentObject: null,
        type: '',
        title: '',
        content: '',
        requireResponse: false,
        responseDeadline: ''
      });
      
      // Notify parent component
      onConsultationCreated();
    } catch (err) {
      console.error("Error creating consultation:", err);
      setError("Có lỗi xảy ra khi tạo tư vấn. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Set minimum date for response deadline (today)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  if (loading && (!users.length || !students.length || !consultationTypes.length)) {
    return (
      <div className="create-consultation">
        <div className="create-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu biểu mẫu...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="create-consultation">
      <div className="create-header">
        <h2>Tạo thông báo/tư vấn mới</h2>
        <button onClick={onBack} className="btn btn-secondary">
          <i className="fas fa-times-circle btn-icon"></i>
          Hủy bỏ
        </button>
      </div>
      
      <div className="create-content">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="consultation-form">
          <div className="form-section">
            <h3>Thông tin người nhận</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="receiver" className="form-label">Người nhận: <span className="required">*</span></label>
                <select 
                  id="receiver"
                  name="receiver"
                  className="form-control"
                  value={formData.receiver}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn người nhận --</option>
                  {users
                    .filter(user => user.role === "Phụ huynh")
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="student" className="form-label">Học sinh liên quan:</label>
                <select 
                  id="student"
                  name="student"
                  className="form-control"
                  value={formData.student}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn học sinh liên quan (nếu có) --</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Nội dung thông báo/tư vấn</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type" className="form-label">Loại thông báo/tư vấn: <span className="required">*</span></label>
                <select 
                  id="type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn loại thông báo/tư vấn --</option>
                  {consultationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="title" className="form-label">Tiêu đề: <span className="required">*</span></label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề thông báo/tư vấn"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="content" className="form-label">Nội dung: <span className="required">*</span></label>
              <textarea 
                id="content"
                name="content"
                className="form-control form-textarea"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung chi tiết thông báo/tư vấn..."
                rows="6"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Cài đặt phản hồi</h3>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-wrapper">
                <input 
                  type="checkbox"
                  id="requireResponse"
                  name="requireResponse"
                  checked={formData.requireResponse}
                  onChange={handleInputChange}
                />
                <label htmlFor="requireResponse">Yêu cầu phản hồi</label>
              </div>
              <div className="checkbox-description">
                <small>Chọn tùy chọn này nếu bạn muốn người nhận phản hồi thông báo/tư vấn.</small>
              </div>
            </div>
            
            {formData.requireResponse && (
              <div className="form-group">
                <label htmlFor="responseDeadline" className="form-label">Thời hạn phản hồi: <span className="required">*</span></label>
                <input 
                  type="date"
                  id="responseDeadline"
                  name="responseDeadline"
                  className="form-control"
                  value={formData.responseDeadline}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  required={formData.requireResponse}
                />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onBack} 
              className="btn btn-secondary"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="button-spinner"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane btn-icon"></i>
                  Gửi thông báo/tư vấn
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConsultation;
