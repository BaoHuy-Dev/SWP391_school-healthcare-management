import React, { useState, useEffect } from 'react';
import './VaccineForm.css';

const VaccineForm = ({ vaccine, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    recommendedAge: '',
    dosages: '',
    interval: '',
    description: '',
    mandatory: false,
    active: true,
    minStockLevel: '20' // Thêm mức tồn kho tối thiểu
  });
  
  const [errors, setErrors] = useState({});
    // Nếu là chỉnh sửa và có dữ liệu vaccine, cập nhật formData
  useEffect(() => {
    if (isEdit && vaccine) {
      setFormData({
        code: vaccine.code || '',
        name: vaccine.name || '',
        recommendedAge: vaccine.recommendedAge || '',
        dosages: vaccine.dosages || '',
        interval: vaccine.interval || '',
        description: vaccine.description || '',
        mandatory: vaccine.mandatory || false,
        active: vaccine.active || true,
        minStockLevel: vaccine.minStockLevel || '20' // Thêm mức tồn kho tối thiểu
      });
    }
  }, [isEdit, vaccine]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code || formData.code.trim() === '') {
      newErrors.code = 'Mã vaccine không được để trống';
    }
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Tên vaccine không được để trống';
    }
    if (!formData.recommendedAge) {
      newErrors.recommendedAge = 'Độ tuổi khuyến nghị không được để trống';
    } else if (isNaN(formData.recommendedAge) || Number(formData.recommendedAge) < 0) {
      newErrors.recommendedAge = 'Độ tuổi phải là số dương';
    }
    if (!formData.dosages) {
      newErrors.dosages = 'Số mũi không được để trống';
    } else if (isNaN(formData.dosages) || Number(formData.dosages) <= 0) {
      newErrors.dosages = 'Số mũi phải là số nguyên dương';
    }
    
    if (Number(formData.dosages) > 1 && (!formData.interval || formData.interval === '')) {
      newErrors.interval = 'Khoảng cách giữa các mũi không được để trống khi có nhiều hơn 1 mũi';
    } else    if (formData.interval && (isNaN(formData.interval) || Number(formData.interval) < 0)) {
      newErrors.interval = 'Khoảng cách phải là số dương';
    }
    
    if (!formData.minStockLevel) {
      newErrors.minStockLevel = 'Mức tồn kho tối thiểu không được để trống';
    } else if (isNaN(formData.minStockLevel) || Number(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = 'Mức tồn kho tối thiểu phải là số dương';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
      // Chuyển đổi dữ liệu từ string sang số
    const vaccineData = {
      ...formData,
      recommendedAge: Number(formData.recommendedAge),
      dosages: Number(formData.dosages),
      interval: formData.interval ? Number(formData.interval) : null,
      minStockLevel: Number(formData.minStockLevel)
    };
    
    // Gọi callback để xử lý submit
    onSubmit(vaccineData);
  };
  
  return (
    <div className="vaccine-form-container">
      <form className="vaccine-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Mã Vaccine *</label>
          <input
            id="code"
            name="code"
            type="text"
            value={formData.code}
            onChange={handleChange}
            className={errors.code ? 'error' : ''}
            disabled={isEdit} // Không cho phép chỉnh sửa mã khi đang edit
          />
          {errors.code && <span className="error-message">{errors.code}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Tên Vaccine *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="recommendedAge">Độ tuổi khuyến nghị (tháng) *</label>
            <input
              id="recommendedAge"
              name="recommendedAge"
              type="number"
              min="0"
              value={formData.recommendedAge}
              onChange={handleChange}
              className={errors.recommendedAge ? 'error' : ''}
            />
            {errors.recommendedAge && <span className="error-message">{errors.recommendedAge}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="dosages">Số mũi cần tiêm *</label>
            <input
              id="dosages"
              name="dosages"
              type="number"
              min="1"
              value={formData.dosages}
              onChange={handleChange}
              className={errors.dosages ? 'error' : ''}
            />
            {errors.dosages && <span className="error-message">{errors.dosages}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="interval">Khoảng cách giữa các mũi (tháng)</label>
          <input
            id="interval"
            name="interval"
            type="number"
            min="0"
            value={formData.interval}
            onChange={handleChange}
            className={errors.interval ? 'error' : ''}
            disabled={Number(formData.dosages) <= 1}
          />
          {errors.interval && <span className="error-message">{errors.interval}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="minStockLevel">Mức tồn kho tối thiểu *</label>
          <input
            id="minStockLevel"
            name="minStockLevel"
            type="number"
            min="1"
            value={formData.minStockLevel}
            onChange={handleChange}
            className={errors.minStockLevel ? 'error' : ''}
          />
          {errors.minStockLevel && <span className="error-message">{errors.minStockLevel}</span>}
          <small className="hint">Cảnh báo khi số lượng tồn kho thấp hơn giá trị này</small>
        </div>
        
        <div className="form-row checkbox-group">
          <div className="checkbox-container">
            <span className="checkbox-label">Vaccine bắt buộc</span>
            <input
              type="checkbox"
              id="mandatory"
              name="mandatory"
              checked={formData.mandatory}
              onChange={handleChange}
            />
          </div>
          
          <div className="checkbox-container">
            <span className="checkbox-label">Đang sử dụng</span>
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <i className="fas fa-times"></i> Hủy bỏ
        </button>
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          <i className={isEdit ? "fas fa-save" : "fas fa-plus"}></i> 
          {isEdit ? "Lưu thay đổi" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
};

export default VaccineForm;