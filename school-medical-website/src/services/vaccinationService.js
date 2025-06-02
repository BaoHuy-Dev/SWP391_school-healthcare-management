// Cấu hình sử dụng dữ liệu giả hay API thật
const config = {
  useMockData: true, // Mặc định sử dụng dữ liệu giả
  apiUrl: 'https://api.example.com/vaccination' // URL API thật khi cần thay đổi
};

// Dữ liệu mẫu cho danh sách lớp
const mockClasses = [
  { id: 1, name: '6A1', grade: 6 },
  { id: 2, name: '6A2', grade: 6 },
  { id: 3, name: '7B1', grade: 7 },
  { id: 4, name: '7B2', grade: 7 },
  { id: 5, name: '8C1', grade: 8 },
  { id: 6, name: '8C2', grade: 8 },
  { id: 7, name: '9A1', grade: 9 },
  { id: 8, name: '9A2', grade: 9 },
  { id: 9, name: '10A1', grade: 10 },
  { id: 10, name: '10A2', grade: 10 },
  { id: 11, name: '11A1', grade: 11 },
  { id: 12, name: '11A2', grade: 11 },
  { id: 13, name: '12A1', grade: 12 },
  { id: 14, name: '12A2', grade: 12 },
];

// Dữ liệu mẫu - trong thực tế, dữ liệu này sẽ được lấy từ backend API
const mockVaccines = [
  {
    id: 1,
    code: 'BCG',
    name: 'Vaccine BCG',
    recommendedAge: 0,
    dosages: 1,
    interval: null,
    mandatory: true,
    active: true,
    description: 'Phòng bệnh lao. Tiêm 1 mũi duy nhất ngay sau khi sinh.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'HepB',
    name: 'Vaccine viêm gan B',
    recommendedAge: 0,
    dosages: 3,
    interval: 2,
    mandatory: true,
    active: true,
    description: 'Phòng bệnh viêm gan siêu vi B.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'OPV',
    name: 'Vaccine bại liệt uống',
    recommendedAge: 2,
    dosages: 3,
    interval: 2,
    mandatory: true,
    active: true,
    description: 'Phòng bệnh bại liệt.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    code: 'DTP',
    name: 'Vaccine bạch hầu - uốn ván - ho gà',
    recommendedAge: 2,
    dosages: 3,
    interval: 2,
    mandatory: true,
    active: true,
    description: 'Phòng bệnh bạch hầu, uốn ván và ho gà.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    code: 'Hib',
    name: 'Vaccine Hib',
    recommendedAge: 2,
    dosages: 3,
    interval: 2,
    mandatory: false,
    active: true,
    description: 'Phòng bệnh viêm màng não mủ, viêm phổi, viêm tai giữa do vi khuẩn Hib.',
    createdAt: '2024-01-01T00:00:00Z'
  },
];

const mockStudents = [
  {
    id: 1,
    studentCode: 'HS001',
    name: 'Nguyễn Văn An',
    dateOfBirth: '2012-05-15',
    gender: 'M',
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
    gender: 'F',
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
    gender: 'M',
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
    gender: 'F',
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
    gender: 'M',
    className: '8C1',
    grade: 8,
    parentPhone: '0966789123',
    parentName: 'Hoàng Thị Giang',
    address: '357 Lê Lợi, Quận 1, TP.HCM'
  }
];

const mockVaccinationRecords = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Nguyễn Văn An',
    studentCode: 'HS001',
    className: '6A1',
    vaccineId: 1,
    vaccineName: 'Vaccine BCG',
    vaccineCode: 'BCG',
    dose: 1,
    dateAdministered: '2012-05-20',
    administrator: 'Bs. Nguyễn Thị Hoa',
    status: 'Hoàn thành',
    nextDoseDate: null,
    sideEffects: 'Không',
    notes: 'Tiêm sau sinh 5 ngày',
    consented: true
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Nguyễn Văn An',
    studentCode: 'HS001',
    className: '6A1',
    vaccineId: 2,
    vaccineName: 'Vaccine viêm gan B',
    vaccineCode: 'HepB',
    dose: 1,
    dateAdministered: '2012-05-20',
    administrator: 'Bs. Nguyễn Thị Hoa',
    status: 'Hoàn thành',
    nextDoseDate: '2012-07-20',
    sideEffects: 'Không',
    notes: 'Tiêm cùng ngày với BCG',
    consented: true
  },
  {
    id: 3,
    studentId: 1,
    studentName: 'Nguyễn Văn An',
    studentCode: 'HS001',
    className: '6A1',
    vaccineId: 2,
    vaccineName: 'Vaccine viêm gan B',
    vaccineCode: 'HepB',
    dose: 2,
    dateAdministered: '2012-07-22',
    administrator: 'Bs. Trần Văn Bình',
    status: 'Hoàn thành',
    nextDoseDate: '2012-09-22',
    sideEffects: 'Sốt nhẹ',
    notes: '',
    consented: true
  },
  {
    id: 4,
    studentId: 1,
    studentName: 'Nguyễn Văn An',
    studentCode: 'HS001',
    className: '6A1',
    vaccineId: 2,
    vaccineName: 'Vaccine viêm gan B',
    vaccineCode: 'HepB',
    dose: 3,
    dateAdministered: null,
    administrator: null,
    status: 'Dự kiến',
    nextDoseDate: null,
    sideEffects: null,
    notes: 'Dự kiến tiêm trong đợt tiêm chủng sắp tới',
    consented: false
  },
  {
    id: 5,
    studentId: 2,
    studentName: 'Trần Thị Bình',
    studentCode: 'HS002',
    className: '6A2',
    vaccineId: 1,
    vaccineName: 'Vaccine BCG',
    vaccineCode: 'BCG',
    dose: 1,
    dateAdministered: '2012-08-25',
    administrator: 'Bs. Nguyễn Thị Hoa',
    status: 'Hoàn thành',
    nextDoseDate: null,
    sideEffects: 'Không',
    notes: 'Tiêm sau sinh 5 ngày',
    consented: true
  },
];

// Mock dữ liệu cho các lô vaccine
const mockVaccineBatches = [
  {
    id: 1,
    vaccineId: 1,
    batchNumber: 'BCG-2024-001',
    manufacturer: 'Viện Vắc xin Pasteur',
    manufactureDate: '2024-01-05',
    expiryDate: '2025-01-05',
    quantity: 100,
    notes: 'Nhập từ Viện Pasteur'
  },
  {
    id: 2,
    vaccineId: 2,
    batchNumber: 'HEPB-2024-001',
    manufacturer: 'GlaxoSmithKline',
    manufactureDate: '2024-02-10',
    expiryDate: '2025-02-10',
    quantity: 50,
    notes: 'Nhập khẩu từ Bỉ'
  },
  {
    id: 3,
    vaccineId: 3,
    batchNumber: 'OPV-2024-001',
    manufacturer: 'Sanofi Pasteur',
    manufactureDate: '2024-03-15',
    expiryDate: '2024-09-15',
    quantity: 30,
    notes: 'Nhập khẩu từ Pháp'
  }
];

// Delay giả lập API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Service API 
const vaccinationService = {  // Lấy tất cả vaccine
  getAllVaccines: async () => {
    try {
      await delay(500);
      
      // Kiểm tra xem mockVaccines có tồn tại và có dữ liệu không
      console.log('Vaccines data before return:', mockVaccines);
      
      if (config.useMockData) {
        // Trả về trực tiếp dữ liệu mock nếu có
        if (!mockVaccines || mockVaccines.length === 0) {
          // Nếu mockVaccines không có dữ liệu, tạo một số dữ liệu mẫu tạm thời
          const tempVaccines = [
            {
              id: 1,
              code: 'BCG',
              name: 'Vaccine BCG',
              recommendedAge: 0,
              dosages: 1,
              interval: null,
              mandatory: true,
              active: true,
              description: 'Phòng bệnh lao. Tiêm 1 mũi duy nhất ngay sau khi sinh.'
            },
            {
              id: 2,
              code: 'HepB',
              name: 'Vaccine viêm gan B',
              recommendedAge: 0,
              dosages: 3,
              interval: 2,
              mandatory: true,
              active: true,
              description: 'Phòng bệnh viêm gan siêu vi B.'
            },
            {
              id: 3,
              code: 'OPV',
              name: 'Vaccine bại liệt uống',
              recommendedAge: 2,
              dosages: 3,
              interval: 2,
              mandatory: true,
              active: true,
              description: 'Phòng bệnh bại liệt.'
            }
          ];
          console.log('Using temporary vaccine data:', tempVaccines);
          return tempVaccines;
        }
        
        console.log('Returning mock vaccines:', mockVaccines.length);
        return [...mockVaccines];
      } else {
        // Xử lý khi dùng API thật (nếu cần)
        const response = await fetch(`${config.apiUrl}/vaccines`);
        if (!response.ok) {
          throw new Error('Failed to fetch vaccines');
        }
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      // Trả về một số vaccine mẫu nếu có lỗi để đảm bảo dropdown có dữ liệu
      const fallbackVaccines = [
        {
          id: 1,
          code: 'BCG',
          name: 'Vaccine BCG',
          description: 'Phòng bệnh lao'
        },
        {
          id: 2,
          code: 'HepB',
          name: 'Vaccine viêm gan B',
          description: 'Phòng bệnh viêm gan B'
        }
      ];
      console.log('Using fallback vaccines due to error');
      return fallbackVaccines;
    }
  },

  // Lấy vaccine theo ID
  getVaccineById: async (id) => {
    await delay(300);
    const vaccine = mockVaccines.find(v => v.id === id);
    if (!vaccine) throw new Error("Không tìm thấy vaccine");
    return { ...vaccine };
  },

  // Thêm vaccine mới
  addVaccine: async (vaccineData) => {
    await delay(600);
    const newVaccine = {
      id: Math.max(...mockVaccines.map(v => v.id)) + 1,
      code: vaccineData.code || `V${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...vaccineData
    };
    
    mockVaccines.push(newVaccine);
    return newVaccine;
  },

  // Cập nhật vaccine
  updateVaccine: async (id, vaccineData) => {
    await delay(500);
    const index = mockVaccines.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vaccine not found');
    
    mockVaccines[index] = {
      ...mockVaccines[index],
      ...vaccineData,
      updatedAt: new Date().toISOString()
    };
    
    return mockVaccines[index];
  },

  // Xóa vaccine
  deleteVaccine: async (id) => {
    await delay(500);
    const initialLength = mockVaccines.length;
    const updatedVaccines = mockVaccines.filter(v => v.id !== id);
    
    if (updatedVaccines.length === initialLength) {
      throw new Error("Không tìm thấy vaccine");
    }
    
    // Cập nhật mảng mockVaccines
    mockVaccines.length = 0;
    mockVaccines.push(...updatedVaccines);
    
    return { success: true, message: "Xóa thành công" };
  },

  // Lấy tất cả học sinh
  getAllStudents: async () => {
    await delay(700);
    return [...mockStudents];
  },
  
  // Tìm kiếm học sinh
  searchStudents: async (filters) => {
    await delay(500);
    
    let filteredStudents = [...mockStudents];
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(keyword) ||
        student.studentCode.toLowerCase().includes(keyword)
      );
    }
    
    if (filters.className) {
      const className = filters.className.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.className.toLowerCase().includes(className)
      );
    }
    
    if (filters.grade) {
      filteredStudents = filteredStudents.filter(student => 
        student.grade === parseInt(filters.grade)
      );
    }
    
    return filteredStudents;
  },
  
  // Lấy thông tin học sinh theo ID
  getStudentById: async (id) => {
    await delay(300);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error("Không tìm thấy học sinh");
    return { ...student };
  },

  // Lấy hồ sơ tiêm chủng của học sinh
  getStudentVaccinationHistory: async (studentId) => {
    await delay(600);
    return mockVaccinationRecords.filter(record => record.studentId === studentId);
  },
  
  // Lấy tất cả bản ghi tiêm chủng
  getAllVaccinationRecords: async () => {
    await delay(800);
    return [...mockVaccinationRecords];
  },
  
  // Tìm kiếm bản ghi tiêm chủng
  searchVaccinationRecords: async (filters) => {
    await delay(600);
    
    let filteredRecords = [...mockVaccinationRecords];
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredRecords = filteredRecords.filter(record => 
        record.studentName.toLowerCase().includes(keyword) ||
        record.studentCode.toLowerCase().includes(keyword) ||
        record.vaccineName.toLowerCase().includes(keyword) ||
        record.vaccineCode.toLowerCase().includes(keyword)
      );
    }
    
    if (filters.status) {
      filteredRecords = filteredRecords.filter(record => 
        record.status === filters.status
      );
    }
    
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      filteredRecords = filteredRecords.filter(record => 
        record.dateAdministered && new Date(record.dateAdministered) >= fromDate
      );
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59, 999);
      filteredRecords = filteredRecords.filter(record => 
        record.dateAdministered && new Date(record.dateAdministered) <= toDate
      );
    }
    
    return filteredRecords;
  },
  
  // Thêm bản ghi tiêm chủng mới
  addVaccinationRecord: async (recordData) => {
    await delay(700);
    
    const newRecord = {
      id: Math.max(...mockVaccinationRecords.map(r => r.id)) + 1,
      createdAt: new Date().toISOString(),
      ...recordData
    };
    
    // Thêm thông tin học sinh và vaccine
    const student = mockStudents.find(s => s.id === parseInt(recordData.studentId));
    if (student) {
      newRecord.studentName = student.name;
      newRecord.studentCode = student.studentCode;
      newRecord.className = student.className;
    }
    
    const vaccine = mockVaccines.find(v => v.id === parseInt(recordData.vaccineId));
    if (vaccine) {
      newRecord.vaccineName = vaccine.name;
      newRecord.vaccineCode = vaccine.code;
    }
    
    mockVaccinationRecords.push(newRecord);
    return newRecord;
  },
  
  // Cập nhật bản ghi tiêm chủng
  updateVaccinationRecord: async (id, recordData) => {
    await delay(600);
    const index = mockVaccinationRecords.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Record not found');
    
    mockVaccinationRecords[index] = {
      ...mockVaccinationRecords[index],
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    
    return mockVaccinationRecords[index];
  },
  
  // Lấy tất cả kế hoạch tiêm chủng
  getAllVaccinationPlans: async () => {
    await delay(500);
    const plans = mockVaccinationPlans.map(plan => {
      const vaccine = mockVaccines.find(v => v.id === plan.vaccineId);
      
      return {
        ...plan,
        vaccineName: vaccine ? vaccine.name : "Unknown",
        vaccineCode: vaccine ? vaccine.vaccineCode : "Unknown",
        progress: plan.totalStudents > 0 ? Math.round((plan.completedStudents / plan.totalStudents) * 100) : 0
      };
    });
    
    return plans;
  },

  // Tạo kế hoạch tiêm chủng mới
  createVaccinationPlan: async (planData) => {
    await delay(800);
    const newId = Math.max(...mockVaccinationPlans.map(p => p.id)) + 1;
    const planCode = `KH${new Date().getFullYear()}-${String(newId).padStart(2, '0')}`;
    const now = new Date().toISOString();
    
    const newPlan = {
      id: newId,
      planCode,
      ...planData,
      completedStudents: 0,
      createdAt: now
    };
    
    mockVaccinationPlans.push(newPlan);
    return { success: true, plan: newPlan };
  },

  // Cập nhật kế hoạch tiêm chủng
  updateVaccinationPlan: async (id, planData) => {
    await delay(700);
    const index = mockVaccinationPlans.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error("Không tìm thấy kế hoạch tiêm chủng");
    }
    
    mockVaccinationPlans[index] = {
      ...mockVaccinationPlans[index],
      ...planData
    };
    
    return { success: true, plan: mockVaccinationPlans[index] };
  },

  // Lấy dữ liệu thống kê
  getVaccinationStats: async () => {
    await delay(900);
    
    // Tổng số học sinh
    const totalStudents = mockStudents.length;
    
    // Tổng số học sinh đã tiêm ít nhất 1 mũi
    const studentsWithVaccination = new Set(mockVaccinationRecords
      .filter(r => r.status === "Hoàn thành")
      .map(r => r.studentId)
    ).size;
    
    // Tỷ lệ tiêm chủng theo loại vaccine
    const vaccineStats = mockVaccines.map(vaccine => {
      const records = mockVaccinationRecords.filter(r => r.vaccineId === vaccine.id && r.status === "Hoàn thành");
      const uniqueStudents = new Set(records.map(r => r.studentId)).size;
      
      return {
        vaccineId: vaccine.id,
        vaccineName: vaccine.name,
        vaccineCode: vaccine.vaccineCode,
        totalVaccinated: uniqueStudents,
        percentage: totalStudents > 0 ? Math.round((uniqueStudents / totalStudents) * 100) : 0,
        mandatory: vaccine.mandatory
      };
    });
    
    // Cảnh báo mũi tiêm sắp đến hạn (giả định)
    const upcomingVaccinations = [
      {
        id: 1,
        studentId: 5,
        studentName: "Vũ Minh Hiếu",
        className: "10A1",
        vaccineId: 2,
        vaccineName: "ComboVac 5 trong 1",
        dueDate: "2023-11-10",
        daysRemaining: 15
      },
      {
        id: 2,
        studentId: 4,
        studentName: "Phạm Thị Hà",
        className: "8A2",
        vaccineId: 4,
        vaccineName: "Sởi-Quai bị-Rubella",
        dueDate: "2023-12-05",
        daysRemaining: 40
      }
    ];
    
    return {
      totalStudents,
      studentsWithVaccination,
      studentsWithoutVaccination: totalStudents - studentsWithVaccination,
      percentageVaccinated: totalStudents > 0 ? Math.round((studentsWithVaccination / totalStudents) * 100) : 0,
      vaccineStats,
      upcomingVaccinations
    };
  },

  // Xuất báo cáo CSV
  exportVaccinationReport: async (type, filters) => {
    await delay(800);
    // Giả lập xuất báo cáo, trả về đường dẫn tới file CSV giả định
    return { 
      success: true, 
      fileUrl: 'data:text/csv;charset=UTF-8,' + encodeURIComponent('Mẫu dữ liệu CSV sẽ được xuất ở đây'),
      message: "Đã xuất báo cáo thành công"
    };
  },

  // Hàm để lấy danh sách các lô vaccine theo vaccineId
  getVaccineBatches: async (vaccineId) => {
    // Kiểm tra xem có sử dụng dữ liệu giả hay không
    if (config.useMockData) {
      // Dùng setTimeout để mô phỏng độ trễ của API
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredBatches = mockVaccineBatches.filter(batch => batch.vaccineId === vaccineId);
          resolve(filteredBatches);
        }, 300);
      });
    }
    
    // Nếu không dùng dữ liệu giả, gọi API thật
    try {
      const response = await fetch(`${config.apiUrl}/vaccines/${vaccineId}/batches`);
      if (!response.ok) {
        throw new Error('Failed to fetch vaccine batches');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vaccine batches:", error);
      throw error;
    }
  },

  // Thêm một lô vaccine mới
  addVaccineBatch: async (batchData) => {
    if (config.useMockData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBatch = {
            id: mockVaccineBatches.length + 1,
            ...batchData,
            manufactureDate: new Date(batchData.manufactureDate).toISOString().split('T')[0],
            expiryDate: new Date(batchData.expiryDate).toISOString().split('T')[0],
          };
          mockVaccineBatches.push(newBatch);
          resolve(newBatch);
        }, 300);
      });
    }
    
    try {
      const response = await fetch(`${config.apiUrl}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add vaccine batch');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding vaccine batch:", error);
      throw error;
    }
  },

  // Xóa một lô vaccine
  deleteBatch: async (batchId) => {
    if (config.useMockData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockVaccineBatches.findIndex(b => b.id === batchId);
          if (index !== -1) {
            mockVaccineBatches.splice(index, 1);
          }
          resolve({ success: true });
        }, 300);
      });
    }
    
    try {
      const response = await fetch(`${config.apiUrl}/batches/${batchId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vaccine batch');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error deleting vaccine batch:", error);
      throw error;
    }
  },

  // Lấy thông tin tồn kho vaccine
  getVaccineInventoryStatus: async () => {
    if (config.useMockData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Tính toán số lượng vaccine từ các lô
          const vaccinesWithQuantity = mockVaccines.map(vaccine => {
            // Lấy các lô của vaccine này
            const batches = mockVaccineBatches.filter(batch => batch.vaccineId === vaccine.id);
            
            // Tính tổng số lượng
            const quantity = batches.reduce((sum, batch) => sum + batch.quantity, 0);
            
            // Lấy lô mới nhất (ngày hết hạn xa nhất)
            const latestBatch = batches.length > 0 
              ? batches.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate))[0] 
              : null;
            
            return {
              ...vaccine,
              quantity,
              minStockLevel: 20, // Giả định mức tồn kho tối thiểu
              latestBatch
            };
          });
          
          // Đếm số lô sắp hết hạn (dưới 30 ngày)
          const today = new Date();
          const expiringBatchesCount = mockVaccineBatches.filter(batch => {
            const expiryDate = new Date(batch.expiryDate);
            const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            return daysDiff > 0 && daysDiff <= 30;
          }).length;
          
          resolve({
            vaccines: vaccinesWithQuantity,
            expiringBatchesCount,
            lastUpdated: new Date().toISOString()
          });
        }, 500);
      });
    }
    
    try {
      const response = await fetch(`${config.apiUrl}/vaccines/inventory`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vaccine inventory status');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching vaccine inventory status:", error);
      throw error;
    }
  },
  // Lấy danh sách lớp học
  getClassList: async () => {
    try {
      if (config.useMockData) {
        await delay(300);
        console.log('Classes data before return:', mockClasses);
        
        // Fallback to sample data if mockClasses is empty
        if (!mockClasses || mockClasses.length === 0) {
          const fallbackClasses = [
            { id: 1, name: '6A1', grade: 6 },
            { id: 2, name: '6A2', grade: 6 },
            { id: 3, name: '7B1', grade: 7 },
            { id: 4, name: '7B2', grade: 7 },
            { id: 5, name: '8C1', grade: 8 },
            { id: 6, name: '8C2', grade: 8 },
            { id: 7, name: '9A1', grade: 9 },
            { id: 8, name: '9A2', grade: 9 },
            { id: 9, name: '10A1', grade: 10 },
            { id: 10, name: '10A2', grade: 10 }
          ];
          console.log('Using fallback class data:', fallbackClasses);
          return fallbackClasses;
        }
        
        return [...mockClasses];
      }
      
      try {
        const response = await fetch(`${config.apiUrl}/classes`);
          if (!response.ok) {
          throw new Error('Failed to fetch class list');
        }
      
        return await response.json();
      } catch (apiError) {
        console.error("Error in API call to fetch class list:", apiError);
        // Fall back to mock data if API fails
        const emergencyFallbackClasses = [
          { id: 1, name: '6A1', grade: 6 },
          { id: 2, name: '6A2', grade: 6 },
          { id: 3, name: '7B1', grade: 7 },
          { id: 4, name: '7B2', grade: 7 }
        ];
        return emergencyFallbackClasses;
      }
    } catch (error) {
      console.error("Error in getClassList:", error);
      // Return empty array instead of throwing so UI doesn't break
      return [];
    }
  }
};

export default vaccinationService;