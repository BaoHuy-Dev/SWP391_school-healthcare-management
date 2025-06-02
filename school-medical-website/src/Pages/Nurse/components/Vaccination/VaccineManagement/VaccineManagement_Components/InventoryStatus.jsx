import React, { useState, useEffect } from 'react';
import './InventoryStatus.css';
import vaccinationService from '../../../../../../services/vaccinationService';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const InventoryStatus = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetchInventoryData();
  }, []);
  
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const data = await vaccinationService.getVaccineInventoryStatus();
      setInventoryData(data);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare data for pie chart (status distribution)
  const prepareStatusData = () => {
    if (!inventoryData) return null;
    
    const statusCounts = {
      inStock: 0,
      lowStock: 0,
      outOfStock: 0
    };
    
    inventoryData.vaccines.forEach(vaccine => {
      if (vaccine.quantity === 0) {
        statusCounts.outOfStock++;
      } else if (vaccine.quantity < vaccine.minStockLevel) {
        statusCounts.lowStock++;
      } else {
        statusCounts.inStock++;
      }
    });
    
    return {
      labels: ['Đủ hàng', 'Sắp hết', 'Hết hàng'],
      datasets: [
        {
          data: [statusCounts.inStock, statusCounts.lowStock, statusCounts.outOfStock],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Prepare data for bar chart (vaccine quantities)
  const prepareQuantityData = () => {
    if (!inventoryData) return null;
    
    return {
      labels: inventoryData.vaccines.map(v => v.name),
      datasets: [
        {
          label: 'Số lượng hiện tại',
          data: inventoryData.vaccines.map(v => v.quantity),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Mức tối thiểu',
          data: inventoryData.vaccines.map(v => v.minStockLevel),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        }
      ],
    };
  };
  
  // Calculate summary statistics
  const calculateSummary = () => {
    if (!inventoryData) return {};
    
    const totalVaccines = inventoryData.vaccines.length;
    const totalQuantity = inventoryData.vaccines.reduce((sum, v) => sum + v.quantity, 0);
    const lowStockCount = inventoryData.vaccines.filter(v => v.quantity > 0 && v.quantity < v.minStockLevel).length;
    const outOfStockCount = inventoryData.vaccines.filter(v => v.quantity === 0).length;
    const expiringCount = inventoryData.expiringBatchesCount || 0;
    
    return {
      totalVaccines,
      totalQuantity,
      lowStockCount,
      outOfStockCount,
      expiringCount
    };
  };
  
  return (
    <div className="inventory-status">
      <div className="inventory-header">
        <h4>Trạng thái tồn kho</h4>
        <button className="btn-refresh" onClick={fetchInventoryData}>
          <i className="fas fa-sync-alt"></i> Cập nhật
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu tồn kho...</p>
        </div>
      ) : !inventoryData ? (
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Không thể tải dữ liệu tồn kho. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <>
          <div className="inventory-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Chi tiết
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <div className="inventory-overview">
              <div className="summary-cards">
                {/* Summary cards */}
                {(() => {
                  const summary = calculateSummary();
                  return (
                    <>
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-syringe"></i>
                        </div>
                        <div className="summary-info">
                          <h5>Tổng loại vaccine</h5>
                          <div className="summary-value">{summary.totalVaccines}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-cubes"></i>
                        </div>
                        <div className="summary-info">
                          <h5>Tổng số lượng</h5>
                          <div className="summary-value">{summary.totalQuantity}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card warning">
                        <div className="summary-icon">
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="summary-info">
                          <h5>Sắp hết hàng</h5>
                          <div className="summary-value">{summary.lowStockCount}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card danger">
                        <div className="summary-icon">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <div className="summary-info">
                          <h5>Hết hàng</h5>
                          <div className="summary-value">{summary.outOfStockCount}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card warning">
                        <div className="summary-icon">
                          <i className="fas fa-hourglass-half"></i>
                        </div>
                        <div className="summary-info">
                          <h5>Sắp hết hạn</h5>
                          <div className="summary-value">{summary.expiringCount}</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="charts-row">
                <div className="chart-container">
                  <h5>Phân bố trạng thái tồn kho</h5>
                  <div className="chart-wrapper">
                    {prepareStatusData() && <Pie data={prepareStatusData()} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }} />}
                  </div>
                </div>
                
                <div className="chart-container">
                  <h5>So sánh lượng tồn</h5>
                  <div className="chart-wrapper">
                    {prepareQuantityData() && <Bar data={prepareQuantityData()} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }} />}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="inventory-details">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Mã vaccine</th>
                    <th>Tên vaccine</th>
                    <th>Số lượng</th>
                    <th>Mức tối thiểu</th>
                    <th>Lô gần nhất</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.vaccines.map(vaccine => (
                    <tr key={vaccine.id} className={
                      vaccine.quantity === 0 
                        ? 'out-of-stock' 
                        : vaccine.quantity < vaccine.minStockLevel 
                          ? 'low-stock' 
                          : ''
                    }>
                      <td>{vaccine.code}</td>
                      <td>{vaccine.name}</td>
                      <td>{vaccine.quantity}</td>
                      <td>{vaccine.minStockLevel}</td>
                      <td>
                        {vaccine.latestBatch 
                          ? `${vaccine.latestBatch.batchNumber} (${new Date(vaccine.latestBatch.expiryDate).toLocaleDateString('vi-VN')})`
                          : 'Không có'}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          vaccine.quantity === 0 
                            ? 'out-of-stock' 
                            : vaccine.quantity < vaccine.minStockLevel 
                              ? 'low-stock' 
                              : 'in-stock'
                        }`}>
                          {vaccine.quantity === 0 
                            ? 'Hết hàng' 
                            : vaccine.quantity < vaccine.minStockLevel 
                              ? 'Sắp hết' 
                              : 'Đủ hàng'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InventoryStatus;
