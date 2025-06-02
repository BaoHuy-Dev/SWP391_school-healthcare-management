import React, { useState, useEffect } from 'react';
import './EditItem.css';
import inventoryService from '../../../../../services/inventoryService';

const EditItem = ({ item, onClose, onItemUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedItem, setEditedItem] = useState({
    id: item.id,
    name: item.name,
    unit: item.unit,
    quantity: item.quantity,
    category: item.category,
    expDate: item.expDate || '',
    warning: item.warning
  });

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await inventoryService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: name === 'quantity' ? parseInt(value) || '' : value
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editedItem.name || !editedItem.unit || !editedItem.quantity || !editedItem.category) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    
    try {
      setLoading(true);
      const updatedItem = await inventoryService.updateItem(editedItem.id, editedItem);
      
      // Thông báo thành công
      alert("Cập nhật vật tư thành công!");
      
      // Gọi callback để thông báo việc cập nhật thành công
      onItemUpdated(updatedItem);
      
      // Đóng modal
      onClose();
      
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật vật tư:", err);
      alert("Có lỗi xảy ra khi cập nhật vật tư. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Sửa thông tin vật tư</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên vật tư <span className="required">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={editedItem.name} 
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Đơn vị <span className="required">*</span></label>
              <input 
                type="text" 
                id="unit" 
                name="unit" 
                value={editedItem.unit} 
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Số lượng <span className="required">*</span></label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                value={editedItem.quantity} 
                onChange={handleInputChange}
                min="0"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Danh mục <span className="required">*</span></label>
              <select 
                id="category" 
                name="category" 
                value={editedItem.category} 
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expDate">Hạn sử dụng</label>
              <input 
                type="date" 
                id="expDate" 
                name="expDate" 
                value={editedItem.expDate} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="warning">Cảnh báo</label>
              <select 
                id="warning" 
                name="warning" 
                value={editedItem.warning} 
                onChange={handleInputChange}
              >
                <option value="Bình thường">Bình thường</option>
                <option value="Thấp">Thấp</option>
                <option value="Cảnh báo">Cảnh báo</option>
              </select>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose} 
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="save-btn" 
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
