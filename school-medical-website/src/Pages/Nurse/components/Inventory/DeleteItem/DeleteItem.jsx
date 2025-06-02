import React, { useState } from 'react';
import './DeleteItem.css';
import inventoryService from '../../../../../services/inventoryService';

const DeleteItem = ({ item, onClose, onItemDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await inventoryService.deleteItem(item.id);
      
      // Thông báo thành công
      alert("Xóa vật tư thành công!");
      
      // Gọi callback để thông báo việc xóa thành công
      onItemDeleted(item.id);
      
      // Đóng modal
      onClose();
    } catch (err) {
      console.error("Lỗi khi xóa vật tư:", err);
      alert("Có lỗi xảy ra khi xóa vật tư. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <div className="delete-modal-header">
          <h3>Xác nhận xóa</h3>
          <button className="delete-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="delete-modal-body">
          <p>Bạn có chắc chắn muốn xóa vật tư <strong>"{item.name}"</strong> không?</p>
          <p className="delete-warning">
            <i className="fas fa-exclamation-triangle"></i>
            Thao tác này không thể hoàn tác!
          </p>
          
          <div className="item-details">
            <div className="item-detail">
              <span>Tên vật tư:</span>
              <span>{item.name}</span>
            </div>
            <div className="item-detail">
              <span>Đơn vị:</span>
              <span>{item.unit}</span>
            </div>
            <div className="item-detail">
              <span>Số lượng:</span>
              <span>{item.quantity}</span>
            </div>
            <div className="item-detail">
              <span>Danh mục:</span>
              <span>{item.category}</span>
            </div>
          </div>
          
          <div className="delete-actions">
            <button 
              className="delete-cancel-btn" 
              onClick={onClose} 
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              className="delete-confirm-btn" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteItem;
