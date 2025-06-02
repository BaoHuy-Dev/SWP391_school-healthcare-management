// Cấu hình sử dụng dữ liệu giả hay API thật
const config = {
  useMockData: true, // Mặc định sử dụng dữ liệu giả
  apiUrl: 'https://api.example.com/inventory' // URL API thật khi cần thay đổi
};
// Dữ liệu mẫu cho các sự kiện y tế
let mockMedicalEvents = [
  {
    id: 1,
    studentId: "SV001",
    studentName: "Nguyễn Văn An",
    eventType: "Tai nạn nhỏ",
    dateTime: "2023-05-28T09:15:00",
    severity: "Nhẹ",
    notifiedParent: true,
    needsFollowUp: false,
    symptoms: "Trầy xước đầu gối khi chơi thể thao",
    treatment: "Làm sạch vết thương, băng vết thương vô trùng",
    medication: "Dung dịch sát khuẩn, băng vô trùng",
    notes: "Học sinh có thể tham gia các hoạt động bình thường sau khi được băng bó",
    handledBy: "Nguyễn Thị Minh - Y tá",
    createdAt: "2023-05-28T09:20:00"
  },
  {
    id: 2,
    studentId: "SV015",
    studentName: "Trần Thị Bình",
    eventType: "Sốt",
    dateTime: "2023-05-29T10:30:00",
    severity: "Trung bình",
    notifiedParent: true,
    needsFollowUp: true,
    symptoms: "Sốt 38.5°C, đau đầu, mệt mỏi",
    treatment: "Cho uống thuốc hạ sốt, nghỉ ngơi tại phòng y tế",
    medication: "Paracetamol 500mg",
    notes: "Đã liên hệ phụ huynh đến đón. Cần theo dõi thêm trong 2-3 ngày tới.",
    handledBy: "Phạm Văn Hòa - Bác sĩ",
    createdAt: "2023-05-29T10:45:00"
  },
  {
    id: 3,
    studentId: "SV042",
    studentName: "Lê Hoàng Duy",
    eventType: "Dị ứng",
    dateTime: "2023-05-30T13:20:00",
    severity: "Nghiêm trọng",
    notifiedParent: true,
    needsFollowUp: true,
    symptoms: "Phát ban da, khó thở nhẹ, sưng môi",
    treatment: "Tiêm thuốc chống dị ứng, theo dõi tình trạng hô hấp",
    medication: "Diphenhydramine, Epinephrine (chuẩn bị sẵn nhưng không dùng đến)",
    notes: "Dị ứng do thức ăn tại căn tin trường. Đã đưa học sinh đến bệnh viện và liên hệ phụ huynh.",
    handledBy: "Phạm Văn Hòa - Bác sĩ",
    createdAt: "2023-05-30T13:30:00"
  }
];

// Danh sách các loại sự kiện y tế
const eventTypes = [
  "Tai nạn nhỏ",
  "Sốt",
  "Dị ứng",
  "Đau đầu",
  "Đau bụng",
  "Chóng mặt",
  "Nôn/Buồn nôn",
  "Khó thở",
  "Chấn thương thể thao",
  "Vấn đề răng miệng",
  "Khác"
];

// Danh sách mức độ nghiêm trọng
const severityLevels = ["Nhẹ", "Trung bình", "Nghiêm trọng"];

// Delay giả lập API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Service API cho sự kiện y tế
const medicalEventsService = {
  // Lấy tất cả sự kiện
  getAllEvents: async () => {
    if (config.useMockData) {
      // Sử dụng mock data
      await delay(500);
      return [...mockMedicalEvents];
    } else {
      // Gọi API thực
      try {
        const response = await fetch(`${config.apiUrl}/medical-events`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sự kiện y tế:", error);
        throw error;
      }
    }
  },

  // Lấy danh sách loại sự kiện
  getEventTypes: async () => {
    await delay(300);
    return [...eventTypes];
  },

  // Lấy danh sách mức độ nghiêm trọng
  getSeverityLevels: async () => {
    await delay(300);
    return [...severityLevels];
  },

  // Lấy sự kiện theo ID
  getEventById: async (id) => {
    await delay(400);
    const event = mockMedicalEvents.find(e => e.id === id);
    if (!event) {
      throw new Error("Không tìm thấy sự kiện y tế");
    }
    return { ...event };
  },

  // Tìm kiếm sự kiện
  searchEvents: async (filters) => {
    await delay(500);
    let filteredEvents = [...mockMedicalEvents];
    
    // Debug thông tin lọc
    console.log("Filters applied:", filters);
    console.log("Total events before filtering:", filteredEvents.length);

    // Lọc theo mã học sinh - cải thiện cách so sánh để tìm kiếm từng phần
    if (filters.studentId && filters.studentId.trim() !== '') {
      const searchTerm = filters.studentId.trim().toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        String(e.studentId).toLowerCase().includes(searchTerm)
      );
      console.log("After studentId filter:", filteredEvents.length);
    }

    // Lọc theo loại sự kiện
    if (filters.eventType) {
      filteredEvents = filteredEvents.filter(e => e.eventType === filters.eventType);
    }

    // Lọc theo mức độ nghiêm trọng
    if (filters.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }

    // Lọc theo ngày (từ ngày)
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      filteredEvents = filteredEvents.filter(e => new Date(e.dateTime) >= fromDate);
    }

    // Lọc theo ngày (đến ngày)
    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59); // Kết thúc ngày
      filteredEvents = filteredEvents.filter(e => new Date(e.dateTime) <= toDate);
    }

    // Lọc theo trạng thái thông báo phụ huynh
    if (filters.notifiedParent !== undefined && filters.notifiedParent !== '') {
      filteredEvents = filteredEvents.filter(e => e.notifiedParent === filters.notifiedParent);
    }

    // Lọc theo trạng thái cần theo dõi
    if (filters.needsFollowUp !== undefined && filters.needsFollowUp !== '') {
      filteredEvents = filteredEvents.filter(e => e.needsFollowUp === filters.needsFollowUp);
    }

    console.log("Final filtered events:", filteredEvents.length);
    return filteredEvents;
  },

  // Thêm sự kiện mới
  addEvent: async (eventData) => {
    await delay(600);
    const newId = Math.max(...mockMedicalEvents.map(e => e.id)) + 1;
    const now = new Date().toISOString();
    
    const newEvent = {
      id: newId,
      ...eventData,
      createdAt: now
    };
    
    mockMedicalEvents.push(newEvent);
    return { success: true, event: newEvent };
  },

  // Cập nhật sự kiện
  updateEvent: async (id, eventData) => {
    await delay(600);
    const index = mockMedicalEvents.findIndex(e => e.id === id);
    
    if (index === -1) {
      throw new Error("Không tìm thấy sự kiện y tế");
    }
    
    mockMedicalEvents[index] = {
      ...mockMedicalEvents[index],
      ...eventData
    };
    
    return { success: true, event: mockMedicalEvents[index] };
  },

  // Xóa sự kiện
  deleteEvent: async (id) => {
    await delay(500);
    const initialLength = mockMedicalEvents.length;
    mockMedicalEvents = mockMedicalEvents.filter(e => e.id !== id);
    
    if (mockMedicalEvents.length === initialLength) {
      throw new Error("Không tìm thấy sự kiện y tế");
    }
    
    return { success: true, message: "Xóa thành công" };
  }
};

export default medicalEventsService;