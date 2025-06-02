import React from 'react';
import './ExportData.css';
import inventoryService from '../../../../../services/inventoryService';

const ExportData = ({ items, onClose }) => {
  // Chuyển đổi dữ liệu thành CSV với hỗ trợ tiếng Việt
  const convertToCSV = (items) => {
    // Thêm BOM (Byte Order Mark) để Excel có thể nhận diện Unicode
    const BOM = '\uFEFF';
    
    // Định nghĩa các cột
    const headers = [
      'ID', 
      'Tên vật tư', 
      'Đơn vị', 
      'Số lượng', 
      'Danh mục', 
      'Hạn sử dụng', 
      'Cảnh báo'
    ];
    
    // Tạo chuỗi header
    let csvContent = BOM + headers.join(',') + '\n';
    
    // Thêm từng dòng dữ liệu
    items.forEach(item => {
      const row = [
        item.id,
        `"${item.name}"`, // Đặt trong dấu ngoặc kép để tránh lỗi khi tên có dấu phẩy
        `"${item.unit}"`,
        item.quantity,
        `"${item.category}"`,
        item.expDate ? `"${new Date(item.expDate).toLocaleDateString('vi-VN')}"` : 'N/A',
        `"${item.warning}"`
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  };
  
  // Hàm tải xuống CSV
  const downloadCSV = () => {
    const csvContent = convertToCSV(items);
    
    // Tạo blob với encoding UTF-8 để hỗ trợ tiếng Việt
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    // Tạo URL để tải xuống
    const url = URL.createObjectURL(blob);
    
    // Tạo element a để kích hoạt việc tải xuống
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_sach_vat_tu_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    
    // Thực hiện tải xuống
    link.click();
    
    // Dọn dẹp
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Đóng modal
    onClose();
  };

  // Xuất dữ liệu theo danh mục 
  const handleExportByCategory = () => {
    // Nhóm các mục theo danh mục
    const groupedItems = {};
    
    items.forEach(item => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
    
    // Tạo file CSV cho từng danh mục
    for (const [category, categoryItems] of Object.entries(groupedItems)) {
      const csvContent = convertToCSV(categoryItems);
      
      // Tạo blob với encoding UTF-8
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      
      // Tạo URL để tải xuống
      const url = URL.createObjectURL(blob);
      
      // Tạo element a để kích hoạt việc tải xuống
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Danh_sach_vat_tu_${category}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
      document.body.appendChild(link);
      
      // Thực hiện tải xuống
      link.click();
      
      // Dọn dẹp
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    // Đóng modal
    onClose();
  };
    // Chức năng xuất Excel đã bị loại bỏ theo yêu cầu

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-container">
        <div className="export-modal-header">
          <h3>Xuất dữ liệu</h3>
          <button className="export-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="export-modal-body">
          <p>Chọn cách xuất dữ liệu:</p>
          
          <div className="export-options">            <button className="export-option-btn csv-btn" onClick={downloadCSV}>
              <i className="fas fa-file-csv"></i>
              <span>CSV (Tất cả)</span>
              <small>Xuất tất cả vật tư sang định dạng CSV</small>
            </button>
            
            <button className="export-option-btn category-btn" onClick={handleExportByCategory}>
              <i className="fas fa-folders"></i>
              <span>CSV (Theo danh mục)</span>
              <small>Xuất thành các file riêng theo danh mục</small>
            </button>
          </div>
          
          <div className="export-summary">
            <p><strong>Tóm tắt dữ liệu:</strong></p>
            <ul>
              <li>Tổng số vật tư: <strong>{items.length}</strong></li>
              <li>Số lượng có cảnh báo thấp: <strong>{items.filter(item => item.warning === 'Thấp').length}</strong></li>
              <li>Số danh mục: <strong>{new Set(items.map(item => item.category)).size}</strong></li>
            </ul>
          </div>
        </div>
        
        <div className="export-modal-footer">
          <button className="export-cancel-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
