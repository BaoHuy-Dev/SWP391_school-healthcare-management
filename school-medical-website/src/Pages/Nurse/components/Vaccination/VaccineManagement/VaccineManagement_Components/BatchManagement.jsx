import React, { useState, useEffect } from 'react';
import './BatchManagement.css';
import vaccinationService from '../../../../../../services/vaccinationService';

const BatchManagement = ({ vaccineId, onBatchChange }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    manufacturer: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vaccineId) {
      fetchBatches();
    }
  }, [vaccineId]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await vaccinationService.getVaccineBatches(vaccineId);
      setBatches(data);
      
      // Notify parent if this causes a change to the total count
      if (onBatchChange) {
        const totalQuantity = data.reduce((sum, batch) => sum + batch.quantity, 0);
        onBatchChange(totalQuantity);
      }
    } catch (error) {
      console.error("Failed to fetch vaccine batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Vui lòng nhập số lô';
    }
    
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Vui lòng nhập nhà sản xuất';
    }
    
    if (!formData.manufactureDate) {
      newErrors.manufactureDate = 'Vui lòng chọn ngày sản xuất';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Vui lòng chọn ngày hết hạn';
    } else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Ngày hết hạn phải lớn hơn ngày hiện tại';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Vui lòng nhập số lượng';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Số lượng phải là số dương';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const batchData = {
        ...formData,
        vaccineId,
        quantity: Number(formData.quantity)
      };
      
      await vaccinationService.addVaccineBatch(batchData);
      setShowAddModal(false);
      setFormData({
        batchNumber: '',
        manufacturer: '',
        manufactureDate: '',
        expiryDate: '',
        quantity: '',
        notes: ''
      });
      
      // Refresh batches
      fetchBatches();
    } catch (error) {
      console.error("Failed to add vaccine batch:", error);
      alert("Không thể thêm lô vaccine. Vui lòng thử lại sau.");
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lô vaccine này?")) {
      try {
        await vaccinationService.deleteBatch(batchId);
        fetchBatches();
      } catch (error) {
        console.error("Failed to delete batch:", error);
        alert("Không thể xóa lô vaccine. Vui lòng thử lại sau.");
      }
    }
  };

  // Calculate days until expiry and return appropriate class
  const getExpiryStatusClass = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) {
      return 'expired';
    } else if (daysRemaining <= 30) {
      return 'expiring-soon';
    } else {
      return 'valid';
    }
  };

  return (
    <div className="batch-management">
      <div className="batch-header">
        <h4>Quản lý lô vaccine</h4>
        <button 
          className="btn-add-batch" 
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Thêm lô mới
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
      ) : batches.length === 0 ? (
        <div className="no-batches">
          <i className="fas fa-box-open"></i>
          <p>Chưa có lô vaccine nào được thêm</p>
          <button 
            className="btn-add-first-batch"
            onClick={() => setShowAddModal(true)}
          >
            Thêm lô vaccine đầu tiên
          </button>
        </div>
      ) : (
        <div className="batch-table-container">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Số lô</th>
                <th>Nhà sản xuất</th>
                <th>Ngày SX</th>
                <th>Hạn sử dụng</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td>{batch.batchNumber}</td>
                  <td>{batch.manufacturer}</td>
                  <td>{new Date(batch.manufactureDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`expiry-date ${getExpiryStatusClass(batch.expiryDate)}`}>
                      {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>{batch.quantity}</td>
                  <td>
                    <span className={`batch-status ${getExpiryStatusClass(batch.expiryDate)}`}>
                      {getExpiryStatusClass(batch.expiryDate) === 'expired' 
                        ? 'Hết hạn' 
                        : getExpiryStatusClass(batch.expiryDate) === 'expiring-soon' 
                          ? 'Sắp hết hạn' 
                          : 'Còn hạn'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-delete-batch" 
                      onClick={() => handleDeleteBatch(batch.id)}
                      title="Xóa lô"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container batch-modal">
            <div className="modal-header">
              <h3>Thêm lô vaccine mới</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="batch-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="batchNumber">Số lô *</label>
                    <input
                      type="text"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className={errors.batchNumber ? 'error' : ''}
                    />
                    {errors.batchNumber && <span className="error-message">{errors.batchNumber}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="manufacturer">Nhà sản xuất *</label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className={errors.manufacturer ? 'error' : ''}
                    />
                    {errors.manufacturer && <span className="error-message">{errors.manufacturer}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="manufactureDate">Ngày sản xuất *</label>
                    <input
                      type="date"
                      id="manufactureDate"
                      name="manufactureDate"
                      value={formData.manufactureDate}
                      onChange={handleInputChange}
                      className={errors.manufactureDate ? 'error' : ''}
                    />
                    {errors.manufactureDate && <span className="error-message">{errors.manufactureDate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiryDate">Ngày hết hạn *</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={errors.expiryDate ? 'error' : ''}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="quantity">Số lượng *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={errors.quantity ? 'error' : ''}
                    min="1"
                  />
                  {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Ghi chú</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i> Hủy
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                <i className="fas fa-save"></i> Lưu lô vaccine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;
