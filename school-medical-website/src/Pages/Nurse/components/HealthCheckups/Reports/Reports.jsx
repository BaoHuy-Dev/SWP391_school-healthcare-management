import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import healthCheckupService from '../../../../../services/healthCheckupService';
import './Reports.css';

const Reports = ({ campaigns, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedReport, setSelectedReport] = useState('general');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');

  // Lấy danh sách các lớp học khi component được tải
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await healthCheckupService.getAllClasses();
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    
    fetchClasses();
    
    // Đặt ngày mặc định cho báo cáo (6 tháng gần đây)
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    setDateRange({
      startDate: sixMonthsAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  }, []);

  // Lọc chiến dịch hiển thị trong dropdown
  const getFilteredCampaigns = () => {
    // Chỉ hiển thị những chiến dịch đã hoàn thành hoặc đang diễn ra
    return campaigns.filter(
      c => c.status === 'Đã hoàn thành' || c.status === 'Đang diễn ra'
    );
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'campaignId') {
      setSelectedCampaignId(value);
    } else if (name === 'class') {
      setSelectedClass(value);
    } else if (name === 'reportType') {
      setSelectedReport(value);
    } else if (name === 'startDate' || name === 'endDate') {
      setDateRange(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Tạo báo cáo
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let reportData;
      
      if (activeTab === 'campaigns') {
        // Báo cáo theo đợt khám cụ thể
        reportData = await healthCheckupService.getCampaignStatistics(
          selectedCampaignId,
          selectedClass !== 'all' ? selectedClass : null
        );
      } else {
        // Báo cáo tổng hợp theo khoảng thời gian
        reportData = await healthCheckupService.getAggregatedStatistics(
          dateRange.startDate,
          dateRange.endDate,
          selectedClass !== 'all' ? selectedClass : null,
          selectedReport
        );
      }
      
      setStatistics(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xuất báo cáo ra file Excel
  const handleExportReport = async () => {
    try {
      await healthCheckupService.exportReport(
        activeTab === 'campaigns' ? 'campaign' : 'aggregated',
        {
          campaignId: selectedCampaignId,
          class: selectedClass !== 'all' ? selectedClass : null,
          reportType: selectedReport,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      );
      
      alert("Báo cáo đã được xuất thành công. Vui lòng kiểm tra thư mục tải xuống.");
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại.");
    }
  };

  // Hiển thị biểu đồ phân phối BMI
  const renderBMIDistributionChart = (bmiData) => {
    if (!bmiData || Object.keys(bmiData).length === 0) return null;
    
    const categories = {
      underweight: { label: 'Thiếu cân', color: '#2196F3' },
      normal: { label: 'Bình thường', color: '#4CAF50' },
      overweight: { label: 'Thừa cân', color: '#FF9800' },
      obese: { label: 'Béo phì', color: '#F44336' }
    };
    
    const total = Object.values(bmiData).reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="chart-container">
        <h4>Phân phối BMI</h4>
        <div className="bar-chart">
          {Object.entries(bmiData).map(([category, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            
            return (
              <div key={category} className="bar-chart-item">
                <div className="bar-label">{categories[category]?.label || category}</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: categories[category]?.color || '#333'
                    }}
                  ></div>
                  <div className="bar-value">{value} ({percentage.toFixed(1)}%)</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          {Object.entries(categories).map(([key, { label, color }]) => (
            <div key={key} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }}></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Hiển thị biểu đồ tình trạng thị lực
  const renderVisionChart = (visionData) => {
    if (!visionData || Object.keys(visionData).length === 0) return null;
    
    const categories = {
      normal: { label: 'Thị lực bình thường', color: '#4CAF50' },
      mild: { label: 'Giảm thị lực nhẹ', color: '#FFEB3B' },
      moderate: { label: 'Giảm thị lực trung bình', color: '#FF9800' },
      severe: { label: 'Giảm thị lực nặng', color: '#F44336' }
    };
    
    const total = Object.values(visionData).reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="chart-container">
        <h4>Tình trạng thị lực</h4>
        <div className="bar-chart">
          {Object.entries(visionData).map(([category, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            
            return (
              <div key={category} className="bar-chart-item">
                <div className="bar-label">{categories[category]?.label || category}</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: categories[category]?.color || '#333'
                    }}
                  ></div>
                  <div className="bar-value">{value} ({percentage.toFixed(1)}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Báo cáo y tế học đường</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="report-tabs"
        className="mb-4"
      >
        <Tab eventKey="campaigns" title="Báo cáo theo đợt khám">
          <div className="report-form-container">
            <Form onSubmit={handleGenerateReport}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chọn đợt khám</Form.Label>
                    <Form.Select
                      name="campaignId"
                      value={selectedCampaignId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Chọn đợt khám --</option>
                      {getFilteredCampaigns().map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name} ({new Date(campaign.scheduledDate).toLocaleDateString('vi-VN')})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lớp</Form.Label>
                    <Form.Select
                      name="class"
                      value={selectedClass}
                      onChange={handleInputChange}
                    >
                      <option value="all">Tất cả các lớp</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="form-buttons">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={!selectedCampaignId || loading}
                >
                  {loading ? 'Đang tạo báo cáo...' : 'Tạo báo cáo'}
                </Button>
              </div>
            </Form>
          </div>
        </Tab>
        
        <Tab eventKey="aggregated" title="Báo cáo tổng hợp">
          <div className="report-form-container">
            <Form onSubmit={handleGenerateReport}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Từ ngày</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đến ngày</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lớp</Form.Label>
                    <Form.Select
                      name="class"
                      value={selectedClass}
                      onChange={handleInputChange}
                    >
                      <option value="all">Tất cả các lớp</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại báo cáo</Form.Label>
                    <Form.Select
                      name="reportType"
                      value={selectedReport}
                      onChange={handleInputChange}
                    >
                      <option value="general">Báo cáo tổng quan</option>
                      <option value="bmi">Chỉ số BMI</option>
                      <option value="vision">Thị lực</option>
                      <option value="dental">Tình trạng răng miệng</option>
                      <option value="followups">Học sinh cần theo dõi</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="form-buttons">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Đang tạo báo cáo...' : 'Tạo báo cáo'}
                </Button>
              </div>
            </Form>
          </div>
        </Tab>
      </Tabs>
      
      {statistics && (
        <div className="report-results">
          <div className="report-header">
            <h3>
              {activeTab === 'campaigns' 
                ? `Báo cáo: ${getFilteredCampaigns().find(c => c.id.toString() === selectedCampaignId.toString())?.name || 'Đợt khám'}`
                : `Báo cáo tổng hợp (${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')})`
              }
            </h3>
            <Button 
              variant="success" 
              onClick={handleExportReport}
              className="export-btn"
            >
              <i className="fas fa-file-excel"></i> Xuất Excel
            </Button>
          </div>
          
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{statistics.totalExamined}</div>
                <div className="summary-label">Học sinh được khám</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{statistics.normalHealthCount}</div>
                <div className="summary-label">Sức khỏe bình thường</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon warning">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{statistics.followupCount}</div>
                <div className="summary-label">Cần theo dõi</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon danger">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{statistics.abnormalHealthCount}</div>
                <div className="summary-label">Bất thường</div>
              </div>
            </div>
          </div>
          
          {/* Phần hiển thị biểu đồ và thống kê */}
          <div className="stats-charts">
            <Row>
              <Col lg={6}>
                {renderBMIDistributionChart(statistics.bmiDistribution)}
              </Col>
              <Col lg={6}>
                {renderVisionChart(statistics.visionDistribution)}
              </Col>
            </Row>
          </div>
          
          {/* Phần bảng danh sách học sinh cần theo dõi */}
          {statistics.followupStudents && statistics.followupStudents.length > 0 && (
            <div className="followup-section">
              <h4>Danh sách học sinh cần theo dõi ({statistics.followupStudents.length})</h4>
              <div className="table-container">
                <table className="followup-table">
                  <thead>
                    <tr>
                      <th>Mã học sinh</th>
                      <th>Họ tên</th>
                      <th>Lớp</th>
                      <th>Ngày khám</th>
                      <th>Lý do theo dõi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.followupStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.class}</td>
                        <td>{new Date(student.examinedDate).toLocaleDateString('vi-VN')}</td>
                        <td>{student.followupReason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Phần đánh giá chung và phân tích xu hướng */}
          {statistics.analysis && (
            <div className="analysis-section">
              <h4>Phân tích và đánh giá</h4>
              <div className="analysis-content" dangerouslySetInnerHTML={{ __html: statistics.analysis }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
