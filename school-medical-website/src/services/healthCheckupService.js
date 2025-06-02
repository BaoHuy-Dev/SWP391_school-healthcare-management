// Cấu hình sử dụng dữ liệu giả hay API thật
const config = {
  useMockData: true, // Mặc định sử dụng dữ liệu giả
  apiUrl: 'https://api.example.com/health-checkups' // URL API thật khi cần thay đổi
};

// Mock data - Trong thực tế, dữ liệu này sẽ được lấy từ API
const mockHealthCheckupCampaigns = [
  {
    id: 1,
    name: 'Khám sức khoẻ định kỳ đầu năm học 2025-2026',
    type: 'Toàn trường',
    targetGrades: 'Tất cả',
    targetClasses: 'Tất cả',
    scheduledDate: '2025-08-15',
    endDate: '2025-09-15',
    checkupItems: [
      'Chiều cao', 'Cân nặng', 'Thị lực', 'Thính lực',
      'Huyết áp', 'Nhịp tim', 'Tình trạng răng'
    ],
    description: 'Kiểm tra sức khoẻ toàn diện cho học sinh đầu năm học mới',
    status: 'Đã hoàn thành',
    totalStudents: 1200,
    completedStudents: 1200,
    specialCases: 45,
    createdAt: '2025-07-01',
    createdBy: 'Nguyễn Thị Hoa'
  },
  {
    id: 2,
    name: 'Khám sức khoẻ đặc biệt - Phòng chống cận thị',
    type: 'Theo khối',
    targetGrades: '6, 7',
    targetClasses: 'Tất cả lớp khối 6, 7',
    scheduledDate: '2025-10-10',
    endDate: '2025-10-25',
    checkupItems: ['Thị lực', 'Kiểm tra mắt chuyên sâu'],
    description: 'Kiểm tra và phát hiện sớm tình trạng cận thị ở học sinh cấp 2',
    status: 'Đang diễn ra',
    totalStudents: 400,
    completedStudents: 280,
    specialCases: 32,
    createdAt: '2025-09-15',
    createdBy: 'Trần Văn Bình'
  },
  {
    id: 3,
    name: 'Khám răng và tư vấn chăm sóc răng miệng',
    type: 'Theo lớp',
    targetGrades: '6',
    targetClasses: '6A1, 6A2, 6B1, 6B2',
    scheduledDate: '2025-11-05',
    endDate: '2025-11-10',
    checkupItems: ['Tình trạng răng', 'Vệ sinh răng miệng'],
    description: 'Kiểm tra răng miệng và hướng dẫn chăm sóc răng cho học sinh lớp 6',
    status: 'Sắp diễn ra',
    totalStudents: 160,
    completedStudents: 0,
    specialCases: 0,
    createdAt: '2025-10-01',
    createdBy: 'Lê Thị Dung'
  },
  {
    id: 4,
    name: 'Khám và tư vấn dinh dưỡng',
    type: 'Định kỳ quý',
    targetGrades: '8, 9',
    targetClasses: 'Tất cả lớp khối 8, 9',
    scheduledDate: '2025-11-20',
    endDate: '2025-12-05',
    checkupItems: ['Chiều cao', 'Cân nặng', 'BMI', 'Tư vấn dinh dưỡng'],
    description: 'Đánh giá tình trạng dinh dưỡng và tư vấn chế độ ăn phù hợp với lứa tuổi',
    status: 'Sắp diễn ra',
    totalStudents: 450,
    completedStudents: 0,
    specialCases: 0,
    createdAt: '2025-10-15',
    createdBy: 'Phạm Thị Hoa'
  },
  {
    id: 5,
    name: 'Kiểm tra sức khoẻ định kỳ giữa năm học',
    type: 'Định kỳ học kỳ',
    targetGrades: 'Tất cả',
    targetClasses: 'Tất cả',
    scheduledDate: '2026-01-10',
    endDate: '2026-02-10',
    checkupItems: [
      'Chiều cao', 'Cân nặng', 'Thị lực', 'Huyết áp',
      'Nhịp tim', 'Nhiệt độ'
    ],
    description: 'Kiểm tra sức khoẻ tổng quát giữa năm học',
    status: 'Chưa bắt đầu',
    totalStudents: 1200,
    completedStudents: 0,
    specialCases: 0,
    createdAt: '2025-11-20',
    createdBy: 'Nguyễn Thị Hoa'
  }
];

// Dữ liệu mẫu cho học sinh
const mockStudents = [
  {
    id: 1,
    studentCode: 'HS001',
    name: 'Nguyễn Văn An',
    dateOfBirth: '2012-05-15',
    gender: 'Nam',
    className: '6A1',
    grade: 6,
    parentPhone: '0901234567',
    parentName: 'Nguyễn Văn Bình',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM'
  },
  {
    id: 2,
    studentCode: 'HS002',
    name: 'Trần Thị Bình',
    dateOfBirth: '2012-08-20',
    gender: 'Nữ',
    className: '6A2',
    grade: 6,
    parentPhone: '0909876543',
    parentName: 'Trần Văn Cường',
    address: '456 Lê Lai, Quận 3, TP.HCM'
  },
  {
    id: 3,
    studentCode: 'HS003',
    name: 'Lê Hoàng Công',
    dateOfBirth: '2011-03-10',
    gender: 'Nam',
    className: '7B1',
    grade: 7,
    parentPhone: '0977123456',
    parentName: 'Lê Văn Dũng',
    address: '789 Trần Hưng Đạo, Quận 5, TP.HCM'
  },
  {
    id: 4,
    studentCode: 'HS004',
    name: 'Phạm Thị Diệu',
    dateOfBirth: '2011-11-25',
    gender: 'Nữ',
    className: '7B2',
    grade: 7,
    parentPhone: '0988654321',
    parentName: 'Phạm Thị Em',
    address: '246 Nguyễn Du, Quận 1, TP.HCM'
  },
  {
    id: 5,
    studentCode: 'HS005',
    name: 'Hoàng Văn Duy',
    dateOfBirth: '2010-07-30',
    gender: 'Nam',
    className: '8C1',
    grade: 8,
    parentPhone: '0966789123',
    parentName: 'Hoàng Thị Giang',
    address: '357 Lê Lợi, Quận 1, TP.HCM'
  },
  // Thêm nhiều học sinh khác...
];

// Mock dữ liệu kết quả khám sức khoẻ của học sinh
const mockCheckupResults = [
  {
    id: 1,
    checkupCampaignId: 1,
    studentId: 1,
    date: '2025-08-16',
    height: 158,
    weight: 50.5,
    bmi: 20.2,
    visionLeft: 10,
    visionRight: 10,
    hearing: 'Bình thường',
    teethStatus: 'Có 1 sâu răng nhẹ',
    bloodPressure: '110/70',
    heartRate: 85,
    temperature: 36.8,
    otherFindings: 'Không có dấu hiệu bất thường',
    recommendations: 'Nên khám định kỳ răng 6 tháng/lần',
    followupRequired: false,
    followupDate: null,
    followupNote: null,
    examiner: 'Bs. Nguyễn Thị Hoa',
    notifiedToParent: true,
    notes: 'Học sinh phát triển tốt'
  },
  {
    id: 2,
    checkupCampaignId: 1,
    studentId: 2,
    date: '2025-08-17',
    height: 152,
    weight: 42.0,
    bmi: 18.2,
    visionLeft: 7,
    visionRight: 8,
    hearing: 'Bình thường',
    teethStatus: 'Bình thường',
    bloodPressure: '105/68',
    heartRate: 88,
    temperature: 36.7,
    otherFindings: 'Thị lực hơi kém, có dấu hiệu cận thị nhẹ',
    recommendations: 'Nên đi khám mắt chuyên sâu, hạn chế dùng thiết bị điện tử kéo dài',
    followupRequired: true,
    followupDate: '2025-11-17',
    followupNote: 'Cần kiểm tra lại thị lực sau 3 tháng',
    examiner: 'Bs. Lê Thị Tuyết',
    notifiedToParent: true,
    notes: 'Phụ huynh đã được tư vấn về việc kiểm tra mắt'
  },
  {
    id: 3,
    checkupCampaignId: 1,
    studentId: 3,
    date: '2025-08-18',
    height: 162,
    weight: 55.5,
    bmi: 21.1,
    visionLeft: 10,
    visionRight: 9,
    hearing: 'Bình thường',
    teethStatus: 'Cần chỉnh nha',
    bloodPressure: '115/72',
    heartRate: 80,
    temperature: 36.5,
    otherFindings: 'Vấn đề về răng cần được điều trị chỉnh nha',
    recommendations: 'Nên đến nha sĩ để được tư vấn chỉnh nha',
    followupRequired: true,
    followupDate: '2025-09-18',
    followupNote: 'Theo dõi tình trạng răng',
    examiner: 'Bs. Trần Văn Bình',
    notifiedToParent: true,
    notes: 'Phụ huynh đã được tư vấn về việc chỉnh nha'
  },
  // Thêm nhiều kết quả khác...
];

// Dữ liệu mẫu cho tiêu chuẩn sức khoẻ theo độ tuổi
const mockHealthStandards = {
  height: {
    // Chiều cao trung bình theo tuổi (cm)
    male: {
      11: { low: 135, normal: 145, high: 158 },
      12: { low: 140, normal: 150, high: 163 },
      13: { low: 145, normal: 156, high: 170 },
      14: { low: 150, normal: 163, high: 175 },
      15: { low: 155, normal: 170, high: 182 },
      16: { low: 160, normal: 173, high: 185 },
      17: { low: 163, normal: 175, high: 187 },
      18: { low: 165, normal: 177, high: 190 }
    },
    female: {
      11: { low: 135, normal: 146, high: 157 },
      12: { low: 140, normal: 152, high: 162 },
      13: { low: 145, normal: 157, high: 166 },
      14: { low: 148, normal: 160, high: 168 },
      15: { low: 150, normal: 162, high: 169 },
      16: { low: 152, normal: 163, high: 170 },
      17: { low: 153, normal: 164, high: 170 },
      18: { low: 154, normal: 164, high: 171 }
    }
  },
  weight: {
    // Cân nặng trung bình theo tuổi (kg)
    male: {
      11: { low: 30, normal: 35, high: 46 },
      12: { low: 33, normal: 40, high: 52 },
      13: { low: 36, normal: 45, high: 58 },
      14: { low: 40, normal: 50, high: 63 },
      15: { low: 45, normal: 55, high: 69 },
      16: { low: 50, normal: 60, high: 74 },
      17: { low: 54, normal: 63, high: 77 },
      18: { low: 56, normal: 65, high: 80 }
    },
    female: {
      11: { low: 30, normal: 37, high: 48 },
      12: { low: 33, normal: 42, high: 54 },
      13: { low: 36, normal: 46, high: 58 },
      14: { low: 38, normal: 48, high: 60 },
      15: { low: 40, normal: 50, high: 62 },
      16: { low: 42, normal: 52, high: 64 },
      17: { low: 43, normal: 53, high: 65 },
      18: { low: 44, normal: 54, high: 66 }
    }
  },
  bmi: {
    // BMI tiêu chuẩn
    children: {
      low: 18.5,
      normal: 22.9,
      high: 25,
      veryHigh: 30
    }
  },
  vision: {
    normal: 10, // Thị lực tiêu chuẩn
    moderate: 7, // Thị lực trung bình
    poor: 4 // Thị lực kém
  },
  bloodPressure: {
    // Huyết áp theo tuổi (mmHg)
    '11-13': {
      low: '90/55',
      normal: '110/65',
      high: '120/80'
    },
    '14-16': {
      low: '100/60',
      normal: '115/70',
      high: '125/82'
    },
    '17-18': {
      low: '105/65',
      normal: '120/75',
      high: '130/85'
    }
  }
};

// Delay giả lập API
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Health Checkup Service API
const healthCheckupService = {
  // Lấy tất cả đợt khám sức khoẻ
  getAllCheckupCampaigns: async () => {
    try {
      await delay(500);

      if (config.useMockData) {
        console.log('Returning mock campaigns data');
        return [...mockHealthCheckupCampaigns];
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns`);
        if (!response.ok) {
          throw new Error('Failed to fetch checkup campaigns');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching checkup campaigns:', error);
      return [];
    }
  },

  // Lấy chi tiết một đợt khám
  getCheckupCampaignById: async (id) => {
    try {
      await delay(300);

      if (config.useMockData) {
        const campaign = mockHealthCheckupCampaigns.find(c => c.id === parseInt(id));
        if (!campaign) {
          throw new Error('Không tìm thấy đợt khám sức khoẻ');
        }
        return { ...campaign };
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign details');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      throw error;
    }
  },
  // Tạo đợt khám sức khoẻ mới
  createCheckupCampaign: async (campaignData) => {
    try {
      await delay(600);
      
      if (config.useMockData) {
        // Tính toán số lượng học sinh dự kiến dựa trên thông tin đợt khám
        let estimatedStudents = 0;
        
        if (campaignData.targetGrades === 'Tất cả') {
          estimatedStudents = 1200; // Ước tính toàn trường
        } else if (campaignData.type === 'Theo khối') {
          // Đếm số khối và ước tính
          const grades = campaignData.targetGrades.split(',').length;
          estimatedStudents = grades * 200; // Trung bình 200 học sinh/khối
        } else if (campaignData.type === 'Theo lớp') {
          // Đếm số lớp và ước tính
          const classes = campaignData.targetClasses.split(',').length;
          estimatedStudents = classes * 40; // Trung bình 40 học sinh/lớp
        }
        
        // Tạo đợt khám mới với đầy đủ thông tin
        const newCampaign = {
          id: mockHealthCheckupCampaigns.length + 1,
          ...campaignData,
          createdAt: new Date().toISOString().split('T')[0],
          totalStudents: estimatedStudents,
          completedStudents: 0,
          specialCases: 0,
          // Đảm bảo các trường bắt buộc
          status: campaignData.status || 'Chưa bắt đầu',
          createdBy: campaignData.createdBy || 'Hệ thống'
        };

        mockHealthCheckupCampaigns.push(newCampaign);
        return newCampaign;
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(campaignData)
        });

        if (!response.ok) {
          throw new Error('Failed to create checkup campaign');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error creating checkup campaign:', error);
      throw error;
    }
  },

  // Cập nhật đợt khám sức khoẻ
  updateCheckupCampaign: async (id, campaignData) => {
    try {
      await delay(500);

      if (config.useMockData) {
        const index = mockHealthCheckupCampaigns.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
          throw new Error('Không tìm thấy đợt khám sức khoẻ');
        }

        mockHealthCheckupCampaigns[index] = {
          ...mockHealthCheckupCampaigns[index],
          ...campaignData
        };

        return mockHealthCheckupCampaigns[index];
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(campaignData)
        });

        if (!response.ok) {
          throw new Error('Failed to update checkup campaign');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error updating checkup campaign:', error);
      throw error;
    }
  },
  // Cập nhật trạng thái đợt khám sức khoẻ
  updateCheckupCampaignStatus: async (id, newStatus) => {
    try {
      await delay(400);

      if (config.useMockData) {
        const index = mockHealthCheckupCampaigns.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
          throw new Error('Không tìm thấy đợt khám sức khoẻ');
        }
        
        // Cập nhật trạng thái
        mockHealthCheckupCampaigns[index] = {
          ...mockHealthCheckupCampaigns[index],
          status: newStatus
        };
        
        return mockHealthCheckupCampaigns[index];
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
          throw new Error('Failed to update campaign status');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  },

  // Xoá đợt khám sức khoẻ
  deleteCheckupCampaign: async (id) => {
    try {
      await delay(500);

      if (config.useMockData) {
        const index = mockHealthCheckupCampaigns.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
          throw new Error('Không tìm thấy đợt khám sức khoẻ');
        }

        mockHealthCheckupCampaigns.splice(index, 1);
        return { success: true, message: 'Xoá thành công' };
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete checkup campaign');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error deleting checkup campaign:', error);
      throw error;
    }
  },

  // Lấy danh sách học sinh trong một đợt khám
  getStudentsByCheckupCampaign: async (campaignId) => {
    try {
      await delay(400);

      if (config.useMockData) {
        // Trong thực tế, bạn sẽ lọc các học sinh thuộc đợt khám dựa vào lớp/khối
        const campaign = mockHealthCheckupCampaigns.find(c => c.id === parseInt(campaignId));
        if (!campaign) {
          throw new Error('Không tìm thấy đợt khám sức khoẻ');
        }

        // Giả lập việc lọc học sinh dựa vào thông tin lớp/khối của đợt khám
        let studentsInCampaign = [...mockStudents];

        // Lọc theo thông tin trong campaign
        if (campaign.targetGrades !== 'Tất cả') {
          const grades = campaign.targetGrades.split(',').map(g => parseInt(g.trim()));
          studentsInCampaign = studentsInCampaign.filter(s => grades.includes(s.grade));
        }

        // Thêm thông tin về trạng thái đã khám chưa
        return studentsInCampaign.map(student => {
          const result = mockCheckupResults.find(r => 
            r.checkupCampaignId === parseInt(campaignId) && r.studentId === student.id
          );
          
          return {
            ...student,
            checkupStatus: result ? 'Đã khám' : 'Chưa khám',
            checkupResultId: result ? result.id : null,
            notifiedToParent: result ? result.notifiedToParent : false
          };
        });
      } else {
        const response = await fetch(`${config.apiUrl}/campaigns/${campaignId}/students`);
        if (!response.ok) {
          throw new Error('Failed to fetch students for checkup campaign');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching students for campaign:', error);
      return [];
    }
  },

  // Lấy kết quả khám sức khoẻ của một học sinh trong một đợt khám
  getStudentCheckupResult: async (campaignId, studentId) => {
    try {
      await delay(300);

      if (config.useMockData) {
        const result = mockCheckupResults.find(r => 
          r.checkupCampaignId === parseInt(campaignId) && r.studentId === parseInt(studentId)
        );
        
        if (!result) {
          return null; // Chưa có kết quả
        }
        
        const student = mockStudents.find(s => s.id === parseInt(studentId));
        return {
          ...result,
          studentName: student ? student.name : 'Không xác định',
          studentClass: student ? student.className : 'Không xác định',
          studentGrade: student ? student.grade : 'Không xác định'
        };
      } else {
        const response = await fetch(`${config.apiUrl}/results/${campaignId}/${studentId}`);
        if (response.status === 404) {
          return null; // Chưa có kết quả
        }
        if (!response.ok) {
          throw new Error('Failed to fetch checkup result');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching checkup result:', error);
      return null;
    }
  },

  // Lưu kết quả khám sức khoẻ mới
  saveCheckupResult: async (resultData) => {
    try {
      await delay(600);

      if (config.useMockData) {
        const newResult = {
          id: mockCheckupResults.length + 1,
          ...resultData,
          date: resultData.date || new Date().toISOString().split('T')[0]
        };

        // Nếu đã có kết quả trước đó, cập nhật
        const existingIndex = mockCheckupResults.findIndex(r => 
          r.checkupCampaignId === parseInt(resultData.checkupCampaignId) && 
          r.studentId === parseInt(resultData.studentId)
        );

        if (existingIndex !== -1) {
          mockCheckupResults[existingIndex] = newResult;
        } else {
          mockCheckupResults.push(newResult);
          
          // Cập nhật số lượng học sinh đã khám trong chiến dịch
          const campaignIndex = mockHealthCheckupCampaigns.findIndex(c => 
            c.id === parseInt(resultData.checkupCampaignId)
          );
          
          if (campaignIndex !== -1) {
            mockHealthCheckupCampaigns[campaignIndex].completedStudents += 1;
            
            if (resultData.followupRequired) {
              mockHealthCheckupCampaigns[campaignIndex].specialCases += 1;
            }
          }
        }

        return newResult;
      } else {
        const response = await fetch(`${config.apiUrl}/results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resultData)
        });

        if (!response.ok) {
          throw new Error('Failed to save checkup result');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error saving checkup result:', error);
      throw error;
    }
  },

  // Cập nhật kết quả khám sức khoẻ
  updateCheckupResult: async (id, resultData) => {
    try {
      await delay(500);

      if (config.useMockData) {
        const index = mockCheckupResults.findIndex(r => r.id === parseInt(id));
        if (index === -1) {
          throw new Error('Không tìm thấy kết quả khám sức khoẻ');
        }

        const oldResult = mockCheckupResults[index];
        const newResult = {
          ...oldResult,
          ...resultData
        };
        
        mockCheckupResults[index] = newResult;
        
        // Cập nhật số lượng trường hợp đặc biệt nếu thay đổi
        if (oldResult.followupRequired !== newResult.followupRequired) {
          const campaignIndex = mockHealthCheckupCampaigns.findIndex(c => 
            c.id === parseInt(newResult.checkupCampaignId)
          );
          
          if (campaignIndex !== -1) {
            if (newResult.followupRequired) {
              mockHealthCheckupCampaigns[campaignIndex].specialCases += 1;
            } else {
              mockHealthCheckupCampaigns[campaignIndex].specialCases -= 1;
            }
          }
        }

        return newResult;
      } else {
        const response = await fetch(`${config.apiUrl}/results/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resultData)
        });

        if (!response.ok) {
          throw new Error('Failed to update checkup result');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error updating checkup result:', error);
      throw error;
    }
  },

  // Lấy lịch sử khám sức khoẻ của một học sinh
  getStudentCheckupHistory: async (studentId) => {
    try {
      await delay(500);

      if (config.useMockData) {
        // Lọc tất cả kết quả của học sinh
        const results = mockCheckupResults
          .filter(r => r.studentId === parseInt(studentId))
          .map(result => {
            const campaign = mockHealthCheckupCampaigns.find(c => c.id === result.checkupCampaignId);
            return {
              ...result,
              checkupName: campaign ? campaign.name : 'Không xác định',
              checkupDate: result.date
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sắp xếp theo ngày giảm dần
        
        return results;
      } else {
        const response = await fetch(`${config.apiUrl}/students/${studentId}/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch student checkup history');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching student history:', error);
      return [];
    }
  },

  // Lấy tiêu chuẩn sức khoẻ theo độ tuổi
  getHealthStandards: async () => {
    try {
      await delay(200);

      if (config.useMockData) {
        return mockHealthStandards;
      } else {
        const response = await fetch(`${config.apiUrl}/standards`);
        if (!response.ok) {
          throw new Error('Failed to fetch health standards');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching health standards:', error);
      return mockHealthStandards; // Fallback to mock data
    }
  },

  // Lấy báo cáo thống kê
  getStatisticalReport: async (filters) => {
    try {
      await delay(700);

      if (config.useMockData) {
        // Lọc kết quả theo filter
        let filteredResults = [...mockCheckupResults];
        
        if (filters.campaignId) {
          filteredResults = filteredResults.filter(r => r.checkupCampaignId === parseInt(filters.campaignId));
        }
        
        if (filters.grade) {
          const studentsInGrade = mockStudents.filter(s => s.grade === parseInt(filters.grade)).map(s => s.id);
          filteredResults = filteredResults.filter(r => studentsInGrade.includes(r.studentId));
        }
        
        if (filters.className) {
          const studentsInClass = mockStudents.filter(s => s.className === filters.className).map(s => s.id);
          filteredResults = filteredResults.filter(r => studentsInClass.includes(r.studentId));
        }
        
        if (filters.fromDate) {
          filteredResults = filteredResults.filter(r => r.date >= filters.fromDate);
        }
        
        if (filters.toDate) {
          filteredResults = filteredResults.filter(r => r.date <= filters.toDate);
        }
        
        // Thống kê
        const totalRecords = filteredResults.length;
        const normalCount = filteredResults.filter(r => !r.followupRequired).length;
        const followupCount = filteredResults.filter(r => r.followupRequired).length;
        
        const eyesightIssues = filteredResults.filter(r => r.visionLeft < 7 || r.visionRight < 7).length;
        const weightIssues = filteredResults.filter(r => r.bmi < 18.5 || r.bmi > 25).length;
        const teethIssues = filteredResults.filter(r => r.teethStatus && r.teethStatus.toLowerCase().includes('sâu')).length;
        
        return {
          totalRecords,
          healthStatus: {
            normal: normalCount,
            requireFollowup: followupCount,
            notifiedToParent: filteredResults.filter(r => r.notifiedToParent).length
          },
          commonIssues: {
            eyesight: eyesightIssues,
            weight: weightIssues,
            teeth: teethIssues
          },
          bmiDistribution: {
            underweight: filteredResults.filter(r => r.bmi < 18.5).length,
            normal: filteredResults.filter(r => r.bmi >= 18.5 && r.bmi <= 25).length,
            overweight: filteredResults.filter(r => r.bmi > 25 && r.bmi <= 30).length,
            obese: filteredResults.filter(r => r.bmi > 30).length
          }
        };
      } else {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${config.apiUrl}/reports/statistics?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch statistical report');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching statistical report:', error);
      return {
        totalRecords: 0,
        healthStatus: { normal: 0, requireFollowup: 0, notifiedToParent: 0 },
        commonIssues: { eyesight: 0, weight: 0, teeth: 0 },
        bmiDistribution: { underweight: 0, normal: 0, overweight: 0, obese: 0 }
      };
    }
  },

  // Xuất báo cáo
  exportReport: async (format, filters) => {
    try {
      await delay(800);

      if (config.useMockData) {
        // Giả lập xuất báo cáo, trả về URL file giả định
        const fileType = format.toLowerCase();
        let fileContent = '';
        
        if (fileType === 'csv') {
          // Tạo mẫu nội dung CSV
          fileContent = 'STT,Mã học sinh,Họ và tên,Lớp,Chiều cao (cm),Cân nặng (kg),BMI,Thị lực trái,Thị lực phải,Tình trạng răng,Huyết áp,Nhịp tim,Cần theo dõi\n';
          
          // Thêm một số dòng dữ liệu giả định
          fileContent += '1,HS001,Nguyễn Văn An,6A1,158,50.5,20.2,10,10,"Bình thường",110/70,85,Không\n';
          fileContent += '2,HS002,Trần Thị Bình,6A2,152,42,18.2,7,8,"Bình thường",105/68,88,Có\n';
          // Mã hoá để tạo URL có thể tải xuống
          const encodedContent = encodeURIComponent(fileContent);
          return {
            success: true,
            fileUrl: `data:text/csv;charset=utf-8,${encodedContent}`,
            fileName: `bao-cao-kham-suc-khoe-${new Date().toISOString().slice(0,10)}.csv`
          };
        } else if (fileType === 'pdf') {
          // Trong thực tế sẽ trả về URL của file PDF đã tạo
          return {
            success: true,
            fileUrl: '#',
            fileName: `bao-cao-kham-suc-khoe-${new Date().toISOString().slice(0,10)}.pdf`,
            message: 'PDF được tạo (giả lập)'
          };
        } else {
          throw new Error('Định dạng không được hỗ trợ');
        }
      } else {
        const queryParams = new URLSearchParams({ format, ...filters }).toString();
        const response = await fetch(`${config.apiUrl}/reports/export?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to export report');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  // Lấy danh sách học sinh cần theo dõi
  getStudentsRequiringFollowup: async () => {
    try {
      await delay(600);

      if (config.useMockData) {
        // Lấy các học sinh cần theo dõi từ kết quả khám
        const followupResults = mockCheckupResults.filter(r => r.followupRequired);
        
        // Map sang thông tin học sinh và kết quả khám
        const studentsWithFollowup = followupResults.map(result => {
          const student = mockStudents.find(s => s.id === result.studentId);
          const campaign = mockHealthCheckupCampaigns.find(c => c.id === result.checkupCampaignId);
          
          return {
            resultId: result.id,
            studentId: result.studentId,
            studentName: student ? student.name : 'Không xác định',
            studentCode: student ? student.studentCode : 'Không xác định',
            className: student ? student.className : 'Không xác định',
            grade: student ? student.grade : 'Không xác định',
            checkupName: campaign ? campaign.name : 'Không xác định',
            checkupDate: result.date,
            followupDate: result.followupDate,
            issue: result.otherFindings,
            recommendations: result.recommendations,
            notifiedToParent: result.notifiedToParent
          };
        });
        
        return studentsWithFollowup.sort((a, b) => new Date(a.followupDate) - new Date(b.followupDate));
      } else {
        const response = await fetch(`${config.apiUrl}/students/followup`);
        if (!response.ok) {
          throw new Error('Failed to fetch students requiring followup');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching students requiring followup:', error);
      return [];
    }
  },
  
  // Lấy danh sách lớp học
  getClassList: async () => {
    try {
      await delay(300);

      if (config.useMockData) {
        // Lấy danh sách lớp từ học sinh
        const classes = [...new Set(mockStudents.map(s => s.className))].sort();
        const grades = [...new Set(mockStudents.map(s => s.grade))].sort((a, b) => a - b);
        
        return {
          classes: classes.map(c => ({ name: c, grade: parseInt(c) })),
          grades: grades.map(g => ({ grade: g, count: mockStudents.filter(s => s.grade === g).length }))
        };
      } else {
        const response = await fetch(`${config.apiUrl}/classes`);
        if (!response.ok) {
          throw new Error('Failed to fetch class list');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching class list:', error);
      return { classes: [], grades: [] };
    }
  }
};

export default healthCheckupService;
