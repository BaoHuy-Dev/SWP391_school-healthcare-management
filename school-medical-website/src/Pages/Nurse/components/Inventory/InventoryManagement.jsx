import React, { useState, useEffect } from 'react';
import './InventoryManagement.css';
import inventoryService from '../../../../services/inventoryService';
import AddItem from './AddItem/AddItem';
import EditItem from './EditItem/EditItem';
import DeleteItem from './DeleteItem/DeleteItem';
import ExportData from './ExportData/ExportData';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name'); // Mặc định tìm theo tên
  const [filteredItems, setFilteredItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Lấy dữ liệu inventory từ service
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const items = await inventoryService.getAllItems();
        setInventoryItems(items);
        setFilteredItems(items);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu kho:", err);
        setError("Không thể tải dữ liệu kho. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Xử lý lọc dữ liệu khi searchTerm hoặc searchField thay đổi
  useEffect(() => {
    filterItems();
  }, [searchTerm, searchField, inventoryItems]);

  // Hàm lọc dữ liệu
  const filterItems = () => {
    if (!searchTerm.trim()) {
      setFilteredItems(inventoryItems);
      return;
    }

    const filtered = inventoryItems.filter(item => {
      const searchValue = String(item[searchField]).toLowerCase();
      return searchValue.includes(searchTerm.toLowerCase());
    });
    
    setFilteredItems(filtered);
  };
  
  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    filterItems();
  };

  // Xử lý thay đổi trường tìm kiếm
  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  // Xử lý thêm mới
  const handleAdd = () => {
    setShowAddModal(true);
  };

  // Xử lý khi thêm thành công
  const handleItemAdded = (newItem) => {
    setInventoryItems([...inventoryItems, newItem]);
  };

  // Xử lý sửa
  const handleEdit = (id) => {
    const itemToEdit = inventoryItems.find(item => item.id === id);
    if (itemToEdit) {
      setSelectedItem(itemToEdit);
      setShowEditModal(true);
    }
  };

  // Xử lý khi sửa thành công
  const handleItemUpdated = (updatedItem) => {
    const updatedItems = inventoryItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setInventoryItems(updatedItems);
    setFilteredItems(updatedItems.filter(item => filteredItems.some(i => i.id === item.id)));
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    const itemToDelete = inventoryItems.find(item => item.id === id);
    if (itemToDelete) {
      setSelectedItem(itemToDelete);
      setShowDeleteModal(true);
    }
  };

  // Xử lý khi xóa thành công
  const handleItemDeleted = (deletedId) => {
    const updatedItems = inventoryItems.filter(item => item.id !== deletedId);
    setInventoryItems(updatedItems);
    setFilteredItems(updatedItems.filter(item => filteredItems.some(i => i.id === item.id)));
  };

  // Xử lý xuất dữ liệu
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Phương thức xác định class cho cảnh báo
  const getWarningClass = (warning) => {
    return warning === 'Thấp' ? 'warning-low' : warning === 'Cảnh báo' ? 'warning-alert' : '';
  };

  // Hiển thị loading
  if (loading && !showAddModal && !showEditModal && !showDeleteModal && !showExportModal) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  // Hiển thị lỗi
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <main className="inventory-content">
      {/* Modal thêm mới */}
      {showAddModal && (
        <AddItem 
          onClose={() => setShowAddModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}

      {/* Modal sửa */}
      {showEditModal && selectedItem && (
        <EditItem 
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onItemUpdated={handleItemUpdated}
        />
      )}

      {/* Modal xóa */}
      {showDeleteModal && selectedItem && (
        <DeleteItem
          item={selectedItem}
          onClose={() => setShowDeleteModal(false)}
          onItemDeleted={handleItemDeleted}
        />
      )}

      {/* Modal xuất dữ liệu */}
      {showExportModal && (
        <ExportData
          items={filteredItems}
          onClose={() => setShowExportModal(false)}
        />
      )}

      <div className="inventory-tools">
        <div className="search-box">
          <select 
            value={searchField} 
            onChange={handleSearchFieldChange}
            className="search-field"
          >
            <option value="name">Tên vật tư</option>
            <option value="unit">Đơn vị</option>
            <option value="category">Danh mục</option>
          </select>
          <input 
            type="text" 
            placeholder={`Tìm kiếm theo ${searchField === 'name' ? 'tên vật tư' : searchField === 'unit' ? 'đơn vị' : 'danh mục'}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button onClick={handleSearch} className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="action-buttons">
          <button className="add-btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Thêm
          </button>
          <button className="export-btn" onClick={handleExport}>
            <i className="fas fa-file-export"></i> Xuất
          </button>
        </div>
      </div>
      
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên vật tư</th>
              <th>Đơn vị</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Hạn sử dụng</th>
              <th>Cảnh báo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{item.expDate ? new Date(item.expDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td className={getWarningClass(item.warning)}>{item.warning}</td>                  <td className="action-cell">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(item.id)} title="Sửa">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)} title="Xóa">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">Không tìm thấy dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default InventoryManagement;