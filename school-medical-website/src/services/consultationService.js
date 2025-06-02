// Mock data service for consultation management

// Simple ID generation function (replacement for uuid)
const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Initial mock data
let consultations = [
  {
    id: "c001",
    sender: {
      id: "u001",
      name: "Nguyễn Văn An",
      role: "Giáo viên"
    },
    receiver: {
      id: "u002",
      name: "Trần Thị Mai",
      role: "Phụ huynh"
    },
    student: {
      id: "s001",
      name: "Trần Văn Bình",
      class: "10A1"
    },
    type: "Cảnh báo sức khỏe",
    title: "Cảnh báo tình trạng thị lực",
    content: "Kính gửi phụ huynh, qua kiểm tra sức khỏe định kỳ, chúng tôi phát hiện học sinh Trần Văn Bình có dấu hiệu giảm thị lực. Đề nghị phụ huynh đưa học sinh đi khám chuyên khoa mắt để có biện pháp điều trị kịp thời.",
    sendDate: "2025-05-28T08:30:00",
    responseDeadline: "2025-06-05T17:00:00",
    requireResponse: true,
    isRead: true,
    responses: [
      {
        id: "r001",
        responder: {
          id: "u002",
          name: "Trần Thị Mai",
          role: "Phụ huynh"
        },
        content: "Cảm ơn thông báo. Tôi sẽ đưa cháu đi khám vào cuối tuần này và phản hồi kết quả sau.",
        responseDate: "2025-05-29T14:25:00"
      }
    ],
    status: "replied"
  },
  {
    id: "c002",
    sender: {
      id: "u003",
      name: "Đỗ Thị Hoa",
      role: "Y tá"
    },
    receiver: {
      id: "u004",
      name: "Phạm Văn Dũng",
      role: "Phụ huynh"
    },
    student: {
      id: "s002",
      name: "Phạm Thị Lan",
      class: "11B2"
    },
    type: "Tư vấn dinh dưỡng",
    title: "Tư vấn chế độ dinh dưỡng cho học sinh thiếu cân",
    content: "Kính gửi phụ huynh, qua theo dõi chỉ số BMI của học sinh Phạm Thị Lan, chúng tôi nhận thấy học sinh có dấu hiệu thiếu cân. Chúng tôi đề xuất một số chế độ dinh dưỡng phù hợp và đề nghị phụ huynh quan tâm thêm đến chế độ ăn uống của học sinh.",
    sendDate: "2025-05-30T10:15:00",
    responseDeadline: "2025-06-10T17:00:00",
    requireResponse: true,
    isRead: false,
    responses: [],
    status: "unread"
  },
  {
    id: "c003",
    sender: {
      id: "u003",
      name: "Đỗ Thị Hoa",
      role: "Y tá"
    },
    receiver: {
      id: "u005",
      name: "Lê Văn Hoàng",
      role: "Phụ huynh"
    },
    student: {
      id: "s003",
      name: "Lê Thị Hương",
      class: "9C3"
    },
    type: "Nhắc nhở tiêm chủng",
    title: "Nhắc nhở lịch tiêm phòng vắc-xin HPV đợt 2",
    content: "Kính gửi phụ huynh, đây là thông báo nhắc nhở về lịch tiêm phòng vắc-xin HPV đợt 2 cho học sinh Lê Thị Hương vào ngày 15/06/2025. Đề nghị phụ huynh sắp xếp thời gian đưa học sinh đến đúng hẹn.",
    sendDate: "2025-05-31T09:45:00",
    responseDeadline: "2025-06-10T17:00:00",
    requireResponse: true,
    isRead: true,
    responses: [],
    status: "read"
  },
  {
    id: "c004",
    sender: {
      id: "u006",
      name: "Trần Văn Cường",
      role: "Giáo viên thể dục"
    },
    receiver: {
      id: "u007",
      name: "Nguyễn Thị Hương",
      role: "Phụ huynh"
    },
    student: {
      id: "s004",
      name: "Nguyễn Văn Đức",
      class: "10A3"
    },
    type: "Đề xuất hoạt động",
    title: "Đề xuất tham gia câu lạc bộ bóng rổ",
    content: "Kính gửi phụ huynh, qua các giờ học thể dục, tôi nhận thấy học sinh Nguyễn Văn Đức có năng khiếu và thể hiện tốt ở môn bóng rổ. Nhà trường có câu lạc bộ bóng rổ và chúng tôi muốn mời học sinh tham gia. Rất mong nhận được sự đồng ý của phụ huynh.",
    sendDate: "2025-06-01T07:30:00",
    responseDeadline: "2025-06-07T17:00:00",
    requireResponse: true,
    isRead: false,
    responses: [],
    status: "unread"
  },
  {
    id: "c005",
    sender: {
      id: "u003",
      name: "Đỗ Thị Hoa",
      role: "Y tá"
    },
    receiver: {
      id: "u008",
      name: "Vũ Thị Ngọc",
      role: "Phụ huynh"
    },
    student: {
      id: "s005",
      name: "Vũ Hoài Nam",
      class: "8A2"
    },
    type: "Cảnh báo sức khỏe",
    title: "Thông báo về tình trạng dị ứng thực phẩm",
    content: "Kính gửi phụ huynh, ngày hôm nay, học sinh Vũ Hoài Nam đã có biểu hiện dị ứng sau khi ăn trưa tại canteen trường. Chúng tôi đã sơ cứu ban đầu và tình trạng đã ổn định. Đề nghị phụ huynh đưa học sinh đi khám để xác định chính xác loại thực phẩm gây dị ứng và thông báo lại cho nhà trường để có biện pháp phòng tránh sau này.",
    sendDate: "2025-06-01T13:20:00",
    responseDeadline: "2025-06-03T17:00:00",
    requireResponse: true,
    isRead: false,
    responses: [],
    status: "urgent"
  }
];

// Users for dropdown selection
const users = [
  { id: "u001", name: "Nguyễn Văn An", role: "Giáo viên" },
  { id: "u002", name: "Trần Thị Mai", role: "Phụ huynh" },
  { id: "u003", name: "Đỗ Thị Hoa", role: "Y tá" },
  { id: "u004", name: "Phạm Văn Dũng", role: "Phụ huynh" },
  { id: "u005", name: "Lê Văn Hoàng", role: "Phụ huynh" },
  { id: "u006", name: "Trần Văn Cường", role: "Giáo viên thể dục" },
  { id: "u007", name: "Nguyễn Thị Hương", role: "Phụ huynh" },
  { id: "u008", name: "Vũ Thị Ngọc", role: "Phụ huynh" }
];

// Students for dropdown selection
const students = [
  { id: "s001", name: "Trần Văn Bình", class: "10A1" },
  { id: "s002", name: "Phạm Thị Lan", class: "11B2" },
  { id: "s003", name: "Lê Thị Hương", class: "9C3" },
  { id: "s004", name: "Nguyễn Văn Đức", class: "10A3" },
  { id: "s005", name: "Vũ Hoài Nam", class: "8A2" },
  { id: "s006", name: "Hoàng Minh Tuấn", class: "12A1" },
  { id: "s007", name: "Trịnh Thị Hoa", class: "11A2" }
];

// Types of consultations
const consultationTypes = [
  "Cảnh báo sức khỏe",
  "Tư vấn dinh dưỡng",
  "Nhắc nhở tiêm chủng",
  "Đề xuất hoạt động",
  "Kết quả khám sức khỏe",
  "Thông báo dịch bệnh",
  "Tư vấn tâm lý",
  "Khác"
];

// Get all consultations with optional filters
export const getConsultations = (filters = {}) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredConsultations = [...consultations];
      
      // Apply filters if provided
      if (filters.type) {
        filteredConsultations = filteredConsultations.filter(c => c.type === filters.type);
      }
      
      if (filters.status) {
        filteredConsultations = filteredConsultations.filter(c => c.status === filters.status);
      }
      
      if (filters.studentId) {
        filteredConsultations = filteredConsultations.filter(c => c.student.id === filters.studentId);
      }
      
      if (filters.sendDateFrom) {
        const fromDate = new Date(filters.sendDateFrom);
        filteredConsultations = filteredConsultations.filter(c => new Date(c.sendDate) >= fromDate);
      }
      
      if (filters.sendDateTo) {
        const toDate = new Date(filters.sendDateTo);
        filteredConsultations = filteredConsultations.filter(c => new Date(c.sendDate) <= toDate);
      }
      
      if (filters.responseDeadlineFrom) {
        const fromDate = new Date(filters.responseDeadlineFrom);
        filteredConsultations = filteredConsultations.filter(c => c.responseDeadline && new Date(c.responseDeadline) >= fromDate);
      }
      
      if (filters.responseDeadlineTo) {
        const toDate = new Date(filters.responseDeadlineTo);
        filteredConsultations = filteredConsultations.filter(c => c.responseDeadline && new Date(c.responseDeadline) <= toDate);
      }
      
      resolve(filteredConsultations);
    }, 300);
  });
};

// Get a single consultation by id
export const getConsultationById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const consultation = consultations.find(c => c.id === id);
      if (consultation) {
        resolve(consultation);
      } else {
        reject(new Error("Không tìm thấy thông báo tư vấn"));
      }
    }, 300);
  });
};

// Create a new consultation
export const createConsultation = (consultationData) => {
  return new Promise((resolve) => {      setTimeout(() => {
      const newConsultation = {
        id: generateId(),
        ...consultationData,
        sendDate: new Date().toISOString(),
        isRead: false,
        responses: [],
        status: 'unread'
      };
      
      consultations.unshift(newConsultation);
      resolve(newConsultation);
    }, 500);
  });
};

// Add a response to a consultation
export const addConsultationResponse = (consultationId, responseData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const consultationIndex = consultations.findIndex(c => c.id === consultationId);
      
      if (consultationIndex === -1) {
        reject(new Error("Không tìm thấy thông báo tư vấn"));
        return;
      }
        const newResponse = {
        id: generateId(),
        ...responseData,
        responseDate: new Date().toISOString()
      };
      
      consultations[consultationIndex].responses.push(newResponse);
      consultations[consultationIndex].status = 'replied';
      
      resolve(consultations[consultationIndex]);
    }, 500);
  });
};

// Mark a consultation as read
export const markConsultationAsRead = (consultationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const consultationIndex = consultations.findIndex(c => c.id === consultationId);
      
      if (consultationIndex === -1) {
        reject(new Error("Không tìm thấy thông báo tư vấn"));
        return;
      }
      
      consultations[consultationIndex].isRead = true;
      if (consultations[consultationIndex].status === 'unread') {
        consultations[consultationIndex].status = 'read';
      }
      
      resolve(consultations[consultationIndex]);
    }, 300);
  });
};

// Get consultation statistics
export const getConsultationStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = consultations.length;
      const read = consultations.filter(c => c.isRead).length;
      const unread = total - read;
      const replied = consultations.filter(c => c.responses.length > 0).length;
      const requiresResponse = consultations.filter(c => c.requireResponse && c.responses.length === 0).length;
      
      // Count urgent consultations (those with deadline within next 2 days)
      const now = new Date();
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(now.getDate() + 2);
      
      const urgent = consultations.filter(c => {
        if (!c.responseDeadline || c.responses.length > 0) return false;
        const deadline = new Date(c.responseDeadline);
        return deadline <= twoDaysFromNow && deadline >= now;
      }).length;
      
      const overdue = consultations.filter(c => {
        if (!c.responseDeadline || c.responses.length > 0) return false;
        return new Date(c.responseDeadline) < now;
      }).length;
      
      resolve({
        total,
        read,
        unread,
        replied,
        requiresResponse,
        urgent,
        overdue
      });
    }, 300);
  });
};

// Get all users for dropdown selection
export const getUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 200);
  });
};

// Get all students for dropdown selection
export const getStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(students);
    }, 200);
  });
};

// Get all consultation types
export const getConsultationTypes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(consultationTypes);
    }, 200);
  });
};
