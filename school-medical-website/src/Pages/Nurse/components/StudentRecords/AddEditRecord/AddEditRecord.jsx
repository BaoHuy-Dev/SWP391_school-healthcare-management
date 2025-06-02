import React, { useState, useEffect } from 'react';
import { 
  updateStudentRecord,
  calculateBMICategory,
  getBMIStandardByAgeGender
} from '../../../../../services/studentRecordsService';
import './AddEditRecord.css';

const AddEditRecord = ({ student, onBack, onSave, students, mode }) => {  const [formData, setFormData] = useState({
    studentId: student ? student.id : '',
    studentName: student ? student.name : '',
    studentClass: student ? student.class : '',
    homeRoomTeacher: student ? student.homeRoomTeacher : '',
    dateOfBirth: student ? student.dateOfBirth : new Date().toISOString().split('T')[0],
    gender: student ? student.gender : 'Nam',
    bloodType: student ? student.bloodType : '',
    healthIndices: {
      height: '',
      weight: '',
      bmi: '',
      bloodPressure: '',
      vision: '',
      hearing: ''
    },
    medicalHistory: {
      allergies: '',
      chronicDiseases: '',
      medicalHistory: ''
    },
    emergencyContact: {
      parentName: '',
      phone: ''
    },
    notes: '',
    imageFile: null,
    imageUrl: ''
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [bmiCategory, setBmiCategory] = useState({ category: '', color: '' });  // Cập nhật form khi student thay đổi
  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.id,
        studentName: student.name,
        studentClass: student.class,
        homeRoomTeacher: student.homeRoomTeacher || '',
        dateOfBirth: student.dateOfBirth || new Date().toISOString().split('T')[0],
        gender: student.gender || 'Nam',
        bloodType: student.bloodType || '',
        healthIndices: {
          height: student.healthIndices.height || '',
          weight: student.healthIndices.weight || '',
          bmi: student.healthIndices.bmi || '',
          bloodPressure: student.healthIndices.bloodPressure || '',
          vision: student.healthIndices.vision || '',
          hearing: student.healthIndices.hearing || ''
        },
        medicalHistory: {
          allergies: student.medicalHistory.allergies || '',
          chronicDiseases: student.medicalHistory.chronicDiseases || '',
          medicalHistory: student.medicalHistory.medicalHistory || ''
        },
        emergencyContact: {
          parentName: student.emergencyContact?.parentName || '',
          phone: student.emergencyContact?.phone || ''
        },
        notes: '',
        imageFile: null,
        imageUrl: student.imageUrl || student.avatar || ''
      });
      
      setSelectedStudent(student);
      
      if (student.healthIndices.bmi) {
        const bmiInfo = calculateBMICategory(student.healthIndices.bmi);
        setBmiCategory(bmiInfo);
      }
    }
  }, [student]);

  // Tính BMI khi chiều cao hoặc cân nặng thay đổi
  useEffect(() => {
    const height = parseFloat(formData.healthIndices.height);
    const weight = parseFloat(formData.healthIndices.weight);
    
    if (height && weight && height > 0) {
      // Đổi từ cm sang m
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const bmiRounded = parseFloat(bmi.toFixed(1));
      
      setFormData(prev => ({
        ...prev,
        healthIndices: {
          ...prev.healthIndices,
          bmi: bmiRounded
        }
      }));
      
      const bmiInfo = calculateBMICategory(bmiRounded);
      setBmiCategory(bmiInfo);
    } else {
      setFormData(prev => ({
        ...prev,
        healthIndices: {
          ...prev.healthIndices,
          bmi: ''
        }
      }));
      setBmiCategory({ category: '', color: '' });
    }
  }, [formData.healthIndices.height, formData.healthIndices.weight]);  // Xử lý khi nhập mã học sinh
  const handleStudentIdChange = (e) => {
    const studentId = e.target.value;
    setFormData(prev => ({ ...prev, studentId }));
    
    // Kiểm tra trùng mã học sinh trong mode add
    if (studentId && mode === 'add') {
      const existingStudent = students.find(s => s.id === studentId);
      if (existingStudent) {
        setError("Mã học sinh đã tồn tại. Vui lòng sử dụng mã khác.");
      } else {
        setError(null);
      }
    }
  };
  
  // Xử lý khi nhập tên học sinh
  const handleStudentNameChange = (e) => {
    const studentName = e.target.value;
    setFormData(prev => ({ ...prev, studentName }));
  };
  
  // Xử lý khi nhập lớp học sinh
  const handleStudentClassChange = (e) => {
    const studentClass = e.target.value;
    setFormData(prev => ({ ...prev, studentClass }));
  };

  // Xử lý khi nhập giáo viên chủ nhiệm
  const handleHomeRoomTeacherChange = (e) => {
    const homeRoomTeacher = e.target.value;
    setFormData(prev => ({ ...prev, homeRoomTeacher }));
  };
  
  // Xử lý khi chọn ngày sinh
  const handleDateOfBirthChange = (e) => {
    const dateOfBirth = e.target.value;
    setFormData(prev => ({ ...prev, dateOfBirth }));
  };
  
  // Xử lý khi chọn giới tính
  const handleGenderChange = (e) => {
    const gender = e.target.value;
    setFormData(prev => ({ ...prev, gender }));
  };
  
  // Xử lý khi chọn nhóm máu
  const handleBloodTypeChange = (e) => {
    const bloodType = e.target.value;
    setFormData(prev => ({ ...prev, bloodType }));
  };
  
  // Xử lý khi nhập thông tin liên hệ khẩn cấp
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  // Xử lý khi người dùng upload ảnh
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: event.target.result
        }));
      };
      
      fileReader.readAsDataURL(file);
    }
  };

  // Xử lý khi nhập chỉ số sức khỏe
  const handleHealthIndicesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      healthIndices: {
        ...prev.healthIndices,
        [name]: value
      }
    }));
  };

  // Xử lý khi nhập thông tin tiền sử bệnh
  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [name]: value
      }
    }));
  };
  
  // Xử lý khi lưu hồ sơ
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId) {
      setError("Vui lòng nhập mã học sinh");
      return;
    }
    
    if (mode === 'add' && !formData.studentName) {
      setError("Vui lòng nhập tên học sinh");
      return;
    }
    
    if (mode === 'add' && !formData.studentClass) {
      setError("Vui lòng nhập lớp của học sinh");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const updateData = {
        healthIndices: formData.healthIndices,
        medicalHistory: formData.medicalHistory,
        status: "Đã hoàn thành"
      };
      
      // Thêm các thông tin cơ bản nếu là thêm mới
      if (mode === 'add') {
        updateData.name = formData.studentName;
        updateData.class = formData.studentClass;
        updateData.homeRoomTeacher = formData.homeRoomTeacher;
        updateData.dateOfBirth = formData.dateOfBirth;
        updateData.gender = formData.gender;
        updateData.bloodType = formData.bloodType;
        updateData.emergencyContact = {
          parentName: formData.emergencyContact.parentName,
          phone: formData.emergencyContact.phone
        };
        updateData.healthRecords = [];
      } else {
        // Cập nhật thông tin cơ bản nếu có chỉnh sửa
        if (student.name !== formData.studentName) updateData.name = formData.studentName;
        if (student.class !== formData.studentClass) updateData.class = formData.studentClass;
        if (student.homeRoomTeacher !== formData.homeRoomTeacher) updateData.homeRoomTeacher = formData.homeRoomTeacher;
        if (student.dateOfBirth !== formData.dateOfBirth) updateData.dateOfBirth = formData.dateOfBirth;
        if (student.gender !== formData.gender) updateData.gender = formData.gender;
        if (student.bloodType !== formData.bloodType) updateData.bloodType = formData.bloodType;
        
        // Cập nhật thông tin liên hệ khẩn cấp
        if (student.emergencyContact?.parentName !== formData.emergencyContact.parentName || 
            student.emergencyContact?.phone !== formData.emergencyContact.phone) {
          updateData.emergencyContact = {
            parentName: formData.emergencyContact.parentName,
            phone: formData.emergencyContact.phone
          };
        }
      }
      
      // Thêm ảnh nếu có
      if (formData.imageUrl) {
        updateData.imageUrl = formData.imageUrl;
        // Trong thực tế, ở đây sẽ upload ảnh lên server và lưu URL thực
      }
      
      // Thêm ghi chú nếu có
      if (formData.notes.trim()) {
        updateData.notes = [{
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          content: formData.notes,
          author: "Y tá" // Trong thực tế là người dùng hiện tại
        }];
      }
      
      // Cập nhật hồ sơ
      await updateStudentRecord(formData.studentId, updateData);
      
      setIsSaving(false);
      onSave(); // Thông báo cho component cha
    } catch (error) {
      setError("Có lỗi xảy ra khi lưu hồ sơ: " + error.message);
      setIsSaving(false);
    }
  };

  // Lấy thông tin BMI chuẩn nếu có học sinh được chọn
  const getBmiStandard = () => {
    if (!selectedStudent) return null;
    
    const birthDate = new Date(selectedStudent.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Điều chỉnh tuổi nếu chưa đến sinh nhật năm nay
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return getBMIStandardByAgeGender(age, selectedStudent.gender);
  };

  const bmiStandard = getBmiStandard();

  return (
    <div className="add-edit-record-container">
      <div className="record-form-header">
        <button onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Quay lại
        </button>
        <h2>{mode === 'add' ? 'Thêm hồ sơ y tế mới' : 'Cập nhật hồ sơ y tế'}</h2>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="record-form">        <div className="form-section">
          <h3>Thông tin học sinh</h3>
          
          {mode === 'add' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Mã học sinh:</label>
                  <input 
                    type="text" 
                    value={formData.studentId} 
                    onChange={handleStudentIdChange}
                    placeholder="Nhập mã học sinh"
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Họ và tên:</label>
                  <input 
                    type="text" 
                    value={formData.studentName} 
                    onChange={handleStudentNameChange}
                    placeholder="Nhập tên học sinh"
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Lớp:</label>
                  <input 
                    type="text" 
                    value={formData.studentClass} 
                    onChange={handleStudentClassChange}
                    placeholder="Nhập lớp học sinh"
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Giáo viên chủ nhiệm:</label>
                  <input 
                    type="text" 
                    value={formData.homeRoomTeacher} 
                    onChange={handleHomeRoomTeacherChange}
                    placeholder="Nhập tên giáo viên chủ nhiệm"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh:</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={handleDateOfBirthChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Giới tính:</label>
                  <select
                    value={formData.gender}
                    onChange={handleGenderChange}
                    className="form-select"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nhóm máu:</label>
                  <select
                    value={formData.bloodType}
                    onChange={handleBloodTypeChange}
                    className="form-select"
                  >
                    <option value="">-- Chọn nhóm máu --</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Chưa xác định">Chưa xác định</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ảnh học sinh:</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="form-input file-input"
                  />
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Ảnh học sinh" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin liên hệ khẩn cấp</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ tên phụ huynh:</label>
                    <input 
                      type="text" 
                      name="parentName"
                      value={formData.emergencyContact.parentName} 
                      onChange={handleEmergencyContactChange}
                      placeholder="Nhập tên phụ huynh"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.emergencyContact.phone} 
                      onChange={handleEmergencyContactChange}
                      placeholder="Nhập số điện thoại liên lạc"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="student-info-display">
                <div className="info-row">
                  <span className="info-label">Họ và tên:</span>
                  <span className="info-value">{selectedStudent?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mã học sinh:</span>
                  <span className="info-value">{selectedStudent?.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lớp:</span>
                  <span className="info-value">{selectedStudent?.class}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Giáo viên chủ nhiệm:</span>
                  <span className="info-value">{selectedStudent?.homeRoomTeacher || "Chưa cập nhật"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày sinh:</span>
                  <span className="info-value">{new Date(selectedStudent?.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Giới tính:</span>
                  <span className="info-value">{selectedStudent?.gender}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nhóm máu:</span>
                  <span className="info-value">{selectedStudent?.bloodType}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ảnh học sinh:</span>
                  {selectedStudent?.imageUrl ? (
                    <div className="student-image">
                      <img src={selectedStudent.imageUrl} alt={selectedStudent.name} />
                    </div>
                  ) : (
                    <span className="info-value">Chưa có ảnh</span>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin liên hệ khẩn cấp</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ tên phụ huynh:</label>
                    <input 
                      type="text" 
                      name="parentName"
                      value={formData.emergencyContact.parentName} 
                      onChange={handleEmergencyContactChange}
                      placeholder="Nhập tên phụ huynh"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.emergencyContact.phone} 
                      onChange={handleEmergencyContactChange}
                      placeholder="Nhập số điện thoại liên lạc"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="form-section">
          <h3>Chỉ số sức khỏe</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Chiều cao (cm):</label>
              <input 
                type="number" 
                name="height"
                value={formData.healthIndices.height} 
                onChange={handleHealthIndicesChange}
                placeholder="Nhập chiều cao (cm)"
                min="0"
                step="0.1"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Cân nặng (kg):</label>
              <input 
                type="number" 
                name="weight"
                value={formData.healthIndices.weight} 
                onChange={handleHealthIndicesChange}
                placeholder="Nhập cân nặng (kg)"
                min="0"
                step="0.1"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group bmi-display">
              <label>BMI:</label>
              <div className="bmi-value-container">
                <input 
                  type="text" 
                  value={formData.healthIndices.bmi} 
                  readOnly
                  className="form-input readonly"
                />
                {formData.healthIndices.bmi && (
                  <span className="bmi-category" style={{ color: bmiCategory.color }}>
                    {bmiCategory.category}
                  </span>
                )}
              </div>
              {bmiStandard && (
                <div className="bmi-standard">
                  <small>Chuẩn độ tuổi: {bmiStandard.min} - {bmiStandard.max}</small>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Huyết áp:</label>
              <input 
                type="text" 
                name="bloodPressure"
                value={formData.healthIndices.bloodPressure} 
                onChange={handleHealthIndicesChange}
                placeholder="Ví dụ: 110/70"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Thị lực:</label>
              <input 
                type="text" 
                name="vision"
                value={formData.healthIndices.vision} 
                onChange={handleHealthIndicesChange}
                placeholder="Ví dụ: 10/10"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Thính lực:</label>
              <input 
                type="text" 
                name="hearing"
                value={formData.healthIndices.hearing} 
                onChange={handleHealthIndicesChange}
                placeholder="Ví dụ: Bình thường"
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Tiền sử bệnh</h3>
          
          <div className="form-group">
            <label>Dị ứng:</label>
            <textarea 
              name="allergies"
              value={formData.medicalHistory.allergies} 
              onChange={handleMedicalHistoryChange}
              placeholder="Nhập thông tin dị ứng của học sinh"
              className="form-textarea"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Bệnh mãn tính:</label>
            <textarea 
              name="chronicDiseases"
              value={formData.medicalHistory.chronicDiseases} 
              onChange={handleMedicalHistoryChange}
              placeholder="Nhập thông tin bệnh mãn tính của học sinh"
              className="form-textarea"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Tiền sử y tế:</label>
            <textarea 
              name="medicalHistory"
              value={formData.medicalHistory.medicalHistory} 
              onChange={handleMedicalHistoryChange}
              placeholder="Nhập tiền sử y tế của học sinh"
              className="form-textarea"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Ghi chú</h3>
          
          <div className="form-group">
            <label>Ghi chú của nhân viên y tế:</label>
            <textarea 
              value={formData.notes} 
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Nhập ghi chú về tình trạng sức khỏe hiện tại của học sinh"
              className="form-textarea"
              rows="5"
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onBack} 
            className="cancel-button"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="button-spinner"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Lưu hồ sơ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditRecord;
