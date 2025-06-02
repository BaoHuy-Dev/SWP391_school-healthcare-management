import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import healthCheckupService from '../../../../../services/healthCheckupService';
import './StudentDetail.css';

const StudentDetail = ({ student, campaign, refreshData, healthStandards }) => {
  const [loading, setLoading] = useState(true);
  const [studentHistory, setStudentHistory] = useState([]);
  const [healthRecord, setHealthRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        
        // Lấy lịch sử khám sức khỏe của học sinh
        const history = await healthCheckupService.getStudentCheckupHistory(student.id);
        setStudentHistory(history);
        
        // Lấy hồ sơ sức khỏe của học sinh
        const record = await healthCheckupService.getStudentHealthRecord(student.id);
        setHealthRecord(record);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setLoading(false);
      }
    };
    
    fetchStudentDetails();
  }, [student.id]);

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  
  // Hàm định dạng ngày giờ đầy đủ
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});
  };
  
  // Màu sắc trạng thái sức khỏe
  const getHealthStatusClass = (status) => {
    switch (status) {
      case 'Bình thường':
        return 'health-normal';
      case 'Cần theo dõi':
        return 'health-followup';
      case 'Bất thường':
        return 'health-abnormal';
      default:
        return '';
    }
  };
  
  // Tạo biểu đồ chiều cao
  const renderHeightChart = () => {
    if (!studentHistory || studentHistory.length < 2) {
      return <div className="no-chart-data">Không đủ dữ liệu để hiển thị biểu đồ</div>;
    }
    
    // Sắp xếp lịch sử theo thời gian
    const sortedHistory = [...studentHistory].sort((a, b) => 
      new Date(a.checkupResults.examinedDate) - new Date(b.checkupResults.examinedDate)
    );
    
    // Chiều cao của biểu đồ
    const chartHeight = 200;
    const maxHeight = Math.max(...sortedHistory.map(h => parseFloat(h.checkupResults.height) || 0));
    const minHeight = Math.min(...sortedHistory.map(h => parseFloat(h.checkupResults.height) || 0));
    const range = maxHeight - minHeight;
    
    return (
      <div className="chart-container">
        <div className="chart-title">Biểu đồ chiều cao (cm)</div>
        <div className="chart" style={{ height: `${chartHeight}px` }}>
          {sortedHistory.map((record, index) => {
            const height = parseFloat(record.checkupResults.height) || 0;
            const barHeight = range > 0 
              ? ((height - minHeight) / range) * chartHeight * 0.8 + chartHeight * 0.1
              : chartHeight * 0.5;
            
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-value">{height}</div>
                <div 
                  className="chart-bar" 
                  style={{ height: `${barHeight}px` }}
                  title={`${formatDate(record.checkupResults.examinedDate)}: ${height} cm`}
                ></div>
                <div className="chart-label">{formatDate(record.checkupResults.examinedDate)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Tạo biểu đồ cân nặng
  const renderWeightChart = () => {
    if (!studentHistory || studentHistory.length < 2) {
      return <div className="no-chart-data">Không đủ dữ liệu để hiển thị biểu đồ</div>;
    }
    
    // Sắp xếp lịch sử theo thời gian
    const sortedHistory = [...studentHistory].sort((a, b) => 
      new Date(a.checkupResults.examinedDate) - new Date(b.checkupResults.examinedDate)
    );
    
    // Chiều cao của biểu đồ
    const chartHeight = 200;
    const maxWeight = Math.max(...sortedHistory.map(h => parseFloat(h.checkupResults.weight) || 0));
    const minWeight = Math.min(...sortedHistory.map(h => parseFloat(h.checkupResults.weight) || 0));
    const range = maxWeight - minWeight;
    
    return (
      <div className="chart-container">
        <div className="chart-title">Biểu đồ cân nặng (kg)</div>
        <div className="chart" style={{ height: `${chartHeight}px` }}>
          {sortedHistory.map((record, index) => {
            const weight = parseFloat(record.checkupResults.weight) || 0;
            const barHeight = range > 0 
              ? ((weight - minWeight) / range) * chartHeight * 0.8 + chartHeight * 0.1
              : chartHeight * 0.5;
            
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-value">{weight}</div>
                <div 
                  className="chart-bar" 
                  style={{ height: `${barHeight}px` }}
                  title={`${formatDate(record.checkupResults.examinedDate)}: ${weight} kg`}
                ></div>
                <div className="chart-label">{formatDate(record.checkupResults.examinedDate)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Tạo biểu đồ BMI
  const renderBMIChart = () => {
    if (!studentHistory || studentHistory.length < 2) {
      return <div className="no-chart-data">Không đủ dữ liệu để hiển thị biểu đồ</div>;
    }
    
    // Sắp xếp lịch sử theo thời gian
    const sortedHistory = [...studentHistory].sort((a, b) => 
      new Date(a.checkupResults.examinedDate) - new Date(b.checkupResults.examinedDate)
    ).filter(h => h.checkupResults.bmi);
    
    if (sortedHistory.length < 2) {
      return <div className="no-chart-data">Không đủ dữ liệu để hiển thị biểu đồ</div>;
    }
    
    // Chiều cao của biểu đồ
    const chartHeight = 200;
    const maxBMI = Math.max(...sortedHistory.map(h => parseFloat(h.checkupResults.bmi) || 0));
    const minBMI = Math.min(...sortedHistory.map(h => parseFloat(h.checkupResults.bmi) || 0));
    const range = maxBMI - minBMI;
    
    return (
      <div className="chart-container">
        <div className="chart-title">Biểu đồ BMI</div>
        <div className="chart" style={{ height: `${chartHeight}px` }}>
          {sortedHistory.map((record, index) => {
            const bmi = parseFloat(record.checkupResults.bmi) || 0;
            const barHeight = range > 0 
              ? ((bmi - minBMI) / range) * chartHeight * 0.8 + chartHeight * 0.1
              : chartHeight * 0.5;
            
            // Xác định màu sắc dựa trên BMI
            let barClass = "chart-bar";
            if (bmi < 18.5) barClass += " underweight";
            else if (bmi < 25) barClass += " normal";
            else if (bmi < 30) barClass += " overweight";
            else barClass += " obese";
            
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-value">{bmi}</div>
                <div 
                  className={barClass} 
                  style={{ height: `${barHeight}px` }}
                  title={`${formatDate(record.checkupResults.examinedDate)}: BMI ${bmi}`}
                ></div>
                <div className="chart-label">{formatDate(record.checkupResults.examinedDate)}</div>
              </div>
            );
          })}
        </div>
        <div className="bmi-legend">
          <div className="bmi-legend-item"><span className="bmi-color underweight"></span> Thiếu cân (&lt;18.5)</div>
          <div className="bmi-legend-item"><span className="bmi-color normal"></span> Bình thường (18.5-24.9)</div>
          <div className="bmi-legend-item"><span className="bmi-color overweight"></span> Thừa cân (25-29.9)</div>
          <div className="bmi-legend-item"><span className="bmi-color obese"></span> Béo phì (≥30)</div>
        </div>
      </div>
    );
  };

  // Tìm kết quả khám hiện tại trong đợt khám này
  const currentCheckup = studentHistory?.find(record => record.campaignId === campaign.id)?.checkupResults;

  return (
    <div className="student-detail-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="student-header">
            <div className="student-header-info">
              <h2>{student.name}</h2>
              <div className="student-subheader">
                <span><i className="fas fa-id-card"></i> Mã học sinh: {student.id}</span>
                <span><i className="fas fa-graduation-cap"></i> Lớp: {student.class}</span>
                <span><i className="fas fa-calendar"></i> Ngày sinh: {formatDate(student.dateOfBirth)}</span>
                <span><i className="fas fa-venus-mars"></i> Giới tính: {student.gender}</span>
              </div>
            </div>
            <Button variant="light" onClick={() => window.print()} className="print-btn">
              <i className="fas fa-print"></i> In thông tin
            </Button>
          </div>

          <Tabs 
            id="student-detail-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 student-tabs"
          >
            <Tab eventKey="current" title="Kết quả khám hiện tại">
              {currentCheckup ? (
                <div className="current-checkup-container">
                  <div className="checkup-header">
                    <h3>Kết quả khám trong đợt: {campaign.name}</h3>
                    <div className="checkup-meta">
                      <span>Ngày khám: {formatDateTime(currentCheckup.examinedDate)}</span>
                      <span className={`health-status ${getHealthStatusClass(student.healthStatus)}`}>
                        {student.healthStatus}
                      </span>
                    </div>
                  </div>

                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Chỉ số cơ bản</h4>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Chiều cao:</td>
                            <td>{currentCheckup.height} cm</td>
                          </tr>
                          <tr>
                            <td>Cân nặng:</td>
                            <td>{currentCheckup.weight} kg</td>
                          </tr>
                          <tr>
                            <td>BMI:</td>
                            <td>{currentCheckup.bmi}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="result-card">
                      <h4>Thị lực và thính lực</h4>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Thị lực mắt trái:</td>
                            <td>{currentCheckup.visionLeft || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td>Thị lực mắt phải:</td>
                            <td>{currentCheckup.visionRight || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td>Thính lực:</td>
                            <td>{currentCheckup.hearing || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="result-card">
                      <h4>Tim mạch</h4>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Huyết áp:</td>
                            <td>{currentCheckup.bloodPressure || 'N/A'} mmHg</td>
                          </tr>
                          <tr>
                            <td>Nhịp tim:</td>
                            <td>{currentCheckup.heartRate || 'N/A'} nhịp/phút</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="result-card">
                      <h4>Răng miệng</h4>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Tình trạng răng:</td>
                            <td>{currentCheckup.dentalStatus || 'Không có dữ liệu'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {currentCheckup.notes && (
                    <div className="notes-section">
                      <h4>Ghi chú bổ sung</h4>
                      <div className="notes-content">
                        {currentCheckup.notes}
                      </div>
                    </div>
                  )}

                  {student.healthStatus === 'Cần theo dõi' && (
                    <div className="followup-section">
                      <h4>Lý do cần theo dõi</h4>
                      <div className="followup-content">
                        {currentCheckup.followupReasons || currentCheckup.followupReason || "Không có thông tin chi tiết"}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-data-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>Học sinh chưa được khám trong đợt khám này</p>
                </div>
              )}
            </Tab>

            <Tab eventKey="history" title="Lịch sử khám">
              {studentHistory.length > 0 ? (
                <div className="history-container">
                  <h3>Lịch sử khám sức khỏe</h3>
                  <div className="history-list">
                    {studentHistory
                      .sort((a, b) => new Date(b.checkupResults.examinedDate) - new Date(a.checkupResults.examinedDate))
                      .map((record, index) => (
                        <div key={index} className="history-item">
                          <div className="history-header">
                            <div className="history-title">
                              <h4>{record.campaignName}</h4>
                              <span className="history-date">
                                Ngày khám: {formatDateTime(record.checkupResults.examinedDate)}
                              </span>
                            </div>
                            <span className={`health-status ${getHealthStatusClass(record.healthStatus)}`}>
                              {record.healthStatus}
                            </span>
                          </div>
                          <div className="history-details">
                            <div className="history-metrics">
                              <div className="metric">
                                <span className="metric-label">Chiều cao:</span>
                                <span className="metric-value">{record.checkupResults.height} cm</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Cân nặng:</span>
                                <span className="metric-value">{record.checkupResults.weight} kg</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">BMI:</span>
                                <span className="metric-value">{record.checkupResults.bmi}</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Thị lực (T/P):</span>
                                <span className="metric-value">
                                  {record.checkupResults.visionLeft}/{record.checkupResults.visionRight}
                                </span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Huyết áp:</span>
                                <span className="metric-value">{record.checkupResults.bloodPressure || 'N/A'}</span>
                              </div>
                            </div>
                            {(record.checkupResults.notes || record.checkupResults.followupReasons) && (
                              <div className="history-notes">
                                {record.checkupResults.followupReasons && (
                                  <div>
                                    <strong>Lý do theo dõi:</strong> {record.checkupResults.followupReasons}
                                  </div>
                                )}
                                {record.checkupResults.notes && (
                                  <div>
                                    <strong>Ghi chú:</strong> {record.checkupResults.notes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="no-data-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>Không tìm thấy lịch sử khám sức khỏe của học sinh này</p>
                </div>
              )}
            </Tab>

            <Tab eventKey="charts" title="Biểu đồ theo dõi">
              <div className="charts-container">
                <div className="charts-grid">
                  <div className="chart-box">
                    {renderHeightChart()}
                  </div>
                  <div className="chart-box">
                    {renderWeightChart()}
                  </div>
                  <div className="chart-box full-width">
                    {renderBMIChart()}
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="health-record" title="Hồ sơ sức khỏe">
              {healthRecord ? (
                <div className="health-record-container">
                  <h3>Hồ sơ sức khỏe học sinh</h3>
                  
                  <div className="health-record-section">
                    <h4>Thông tin cơ bản</h4>
                    <table className="health-record-table">
                      <tbody>
                        <tr>
                          <td>Nhóm máu:</td>
                          <td>{healthRecord.bloodType || 'Chưa có thông tin'}</td>
                        </tr>
                        <tr>
                          <td>Chiều cao khi nhập học:</td>
                          <td>{healthRecord.initialHeight} cm</td>
                        </tr>
                        <tr>
                          <td>Cân nặng khi nhập học:</td>
                          <td>{healthRecord.initialWeight} kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {healthRecord.allergies && healthRecord.allergies.length > 0 && (
                    <div className="health-record-section">
                      <h4>Dị ứng</h4>
                      <ul className="allergies-list">
                        {healthRecord.allergies.map((allergy, index) => (
                          <li key={index}>
                            <span className="allergy-type">{allergy.type}:</span>
                            <span className="allergy-description">{allergy.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {healthRecord.chronicConditions && healthRecord.chronicConditions.length > 0 && (
                    <div className="health-record-section">
                      <h4>Bệnh mãn tính</h4>
                      <ul className="conditions-list">
                        {healthRecord.chronicConditions.map((condition, index) => (
                          <li key={index}>
                            <div className="condition-name">{condition.name}</div>
                            <div className="condition-details">
                              <span>Chẩn đoán: {formatDate(condition.diagnosedDate)}</span>
                              <span>Ghi chú: {condition.notes || 'Không có'}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {healthRecord.medications && healthRecord.medications.length > 0 && (
                    <div className="health-record-section">
                      <h4>Thuốc đang sử dụng</h4>
                      <ul className="medications-list">
                        {healthRecord.medications.map((medication, index) => (
                          <li key={index}>
                            <div className="medication-name">{medication.name}</div>
                            <div className="medication-details">
                              <span>Liều lượng: {medication.dosage}</span>
                              <span>Tần suất: {medication.frequency}</span>
                              <span>Lý do: {medication.reason}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {healthRecord.emergencyContact && (
                    <div className="health-record-section">
                      <h4>Liên hệ khẩn cấp</h4>
                      <table className="health-record-table">
                        <tbody>
                          <tr>
                            <td>Tên:</td>
                            <td>{healthRecord.emergencyContact.name}</td>
                          </tr>
                          <tr>
                            <td>Quan hệ:</td>
                            <td>{healthRecord.emergencyContact.relationship}</td>
                          </tr>
                          <tr>
                            <td>Số điện thoại:</td>
                            <td>{healthRecord.emergencyContact.phone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {healthRecord.notes && (
                    <div className="health-record-section">
                      <h4>Ghi chú bổ sung</h4>
                      <div className="health-record-notes">
                        {healthRecord.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-data-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>Chưa có hồ sơ sức khỏe cho học sinh này</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default StudentDetail;
