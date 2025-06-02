// Dịch vụ để quản lý hồ sơ y tế của học sinh
// Dữ liệu mẫu cho học sinh
const studentsData = [
  {    id: "SV001",
    name: "Nguyễn Văn An",
    class: "10A1",
    homeRoomTeacher: "Nguyễn Thị Hương",
    dateOfBirth: "2008-05-15",
    gender: "Nam",
    bloodType: "O+",
    lastUpdated: "2025-05-15",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=1",
    imageUrl: "https://i.pravatar.cc/300?img=1",
    emergencyContact: {
      parentName: "Nguyễn Văn Bình",
      phone: "0912345678"
    },
    healthIndices: {
      height: 165,
      weight: 55,
      bmi: 20.2,
      bloodPressure: "110/70",
      vision: "8/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng phấn hoa, hải sản",
      chronicDiseases: "Không",
      medicalHistory: "Phẫu thuật ruột thừa năm 2023"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-15",
        content: "Học sinh đã hoàn thành khám sức khỏe định kỳ. Cần theo dõi thêm về tình trạng dị ứng.",
        author: "Y tá Ngọc"
      }
    ],
    healthRecords: [
      {
        date: "2025-01-15",
        height: 163,
        weight: 52,
        bmi: 19.6
      },
      {
        date: "2025-05-15",
        height: 165,
        weight: 55,
        bmi: 20.2
      }
    ]
  },
  {    id: "SV002",
    name: "Trần Thị Bình",
    class: "11A2",
    homeRoomTeacher: "Lê Minh Tuấn",
    dateOfBirth: "2007-08-20",
    gender: "Nữ",
    bloodType: "A+",
    lastUpdated: "2025-05-10",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=5",
    imageUrl: "https://i.pravatar.cc/300?img=5",
    emergencyContact: {
      parentName: "Trần Văn Chính",
      phone: "0923456789"
    },
    healthIndices: {
      height: 158,
      weight: 48,
      bmi: 19.2,
      bloodPressure: "100/65",
      vision: "9/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Không",
      chronicDiseases: "Hen suyễn nhẹ",
      medicalHistory: "Tiêm ngừa đầy đủ"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-10",
        content: "Học sinh cần mang theo thuốc xịt hen suyễn khi tham gia hoạt động thể thao ngoài trời.",
        author: "Y tá Linh"
      }
    ],
    healthRecords: [
      {
        date: "2025-01-10",
        height: 157,
        weight: 46,
        bmi: 18.7
      },
      {
        date: "2025-05-10",
        height: 158,
        weight: 48,
        bmi: 19.2
      }
    ]
  },
  {    id: "SV003",
    name: "Lê Hoàng Công",
    class: "12B3",
    homeRoomTeacher: "Trần Thị Mai",
    dateOfBirth: "2006-12-03",
    gender: "Nam",
    bloodType: "B+",
    lastUpdated: "2025-04-20",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=3",
    imageUrl: "https://i.pravatar.cc/300?img=3",
    emergencyContact: {
      parentName: "Lê Thị Dung",
      phone: "0934567890"
    },
    healthIndices: {
      height: 175,
      weight: 70,
      bmi: 22.9,
      bloodPressure: "120/80",
      vision: "10/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng bụi",
      chronicDiseases: "Không",
      medicalHistory: "Gãy tay phải năm 2022, đã phục hồi hoàn toàn"
    },
    notes: [
      {
        id: 1,
        date: "2025-04-20",
        content: "Học sinh có thể lực tốt, phù hợp tham gia đội tuyển thể thao của trường.",
        author: "Y tá Hà"
      }
    ],
    healthRecords: [
      {
        date: "2024-10-15",
        height: 173,
        weight: 68,
        bmi: 22.7
      },
      {
        date: "2025-04-20",
        height: 175,
        weight: 70,
        bmi: 22.9
      }
    ]
  },
  {    id: "SV004",
    name: "Phạm Thị Diệu",
    class: "9C2",
    homeRoomTeacher: "Phạm Văn Hiến",
    dateOfBirth: "2009-02-25",
    gender: "Nữ",
    bloodType: "O-",
    lastUpdated: "2025-05-20",
    status: "Chưa hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=7",
    imageUrl: "https://i.pravatar.cc/300?img=7",
    emergencyContact: {
      parentName: "Phạm Văn Em",
      phone: "0945678901"
    },
    healthIndices: {
      height: 155,
      weight: 45,
      bmi: 18.7,
      bloodPressure: "105/65",
      vision: "7/10",
      hearing: "Cần kiểm tra thêm"
    },
    medicalHistory: {
      allergies: "Không",
      chronicDiseases: "Không",
      medicalHistory: "Viêm họng thường xuyên"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-20",
        content: "Học sinh cần kiểm tra thính lực chi tiết hơn vào đợt khám sức khỏe tiếp theo.",
        author: "Y tá Ngọc"
      }
    ],
    healthRecords: [
      {
        date: "2024-11-20",
        height: 153,
        weight: 42,
        bmi: 17.9
      },
      {
        date: "2025-05-20",
        height: 155,
        weight: 45,
        bmi: 18.7
      }
    ]
  },
  {
    id: "SV005",
    name: "Hoàng Văn Duy",
    class: "8A1",
    dateOfBirth: "2010-07-10",
    gender: "Nam",
    bloodType: "AB+",
    lastUpdated: "2025-05-05",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=8",
    emergencyContact: {
      parentName: "Hoàng Thị Giang",
      phone: "0956789012"
    },
    healthIndices: {
      height: 160,
      weight: 52,
      bmi: 20.3,
      bloodPressure: "110/70",
      vision: "9/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng thời tiết",
      chronicDiseases: "Không",
      medicalHistory: "Tiêm ngừa đầy đủ"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-05",
        content: "Học sinh có tình trạng dị ứng theo mùa, đã hướng dẫn cách phòng ngừa.",
        author: "Y tá Linh"
      }
    ],
    healthRecords: [
      {
        date: "2024-11-05",
        height: 157,
        weight: 48,
        bmi: 19.5
      },
      {
        date: "2025-05-05",
        height: 160,
        weight: 52,
        bmi: 20.3
      }
    ]
  },
  {
    id: "SV006",
    name: "Vũ Thị Hà",
    class: "10A2",
    dateOfBirth: "2008-09-12",
    gender: "Nữ",
    bloodType: "A+",
    lastUpdated: "2025-04-15",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=9",
    emergencyContact: {
      parentName: "Vũ Văn Hiếu",
      phone: "0967890123"
    },
    healthIndices: {
      height: 162,
      weight: 50,
      bmi: 19.1,
      bloodPressure: "100/65",
      vision: "8/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Không",
      chronicDiseases: "Không",
      medicalHistory: "Từng bị gãy tay trái năm 2022"
    },
    notes: [
      {
        id: 1,
        date: "2025-04-15",
        content: "Học sinh có sức khỏe tốt. Khuyến nghị nên đeo kính khi đọc sách.",
        author: "Y tá Hà"
      }
    ],
    healthRecords: [
      {
        date: "2024-10-15",
        height: 160,
        weight: 48,
        bmi: 18.8
      },
      {
        date: "2025-04-15",
        height: 162,
        weight: 50,
        bmi: 19.1
      }
    ]
  },
  {
    id: "SV007",
    name: "Đỗ Minh Khánh",
    class: "11B1",
    dateOfBirth: "2007-03-30",
    gender: "Nam",
    bloodType: "B-",
    lastUpdated: "2025-05-12",
    status: "Chưa hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=12",
    emergencyContact: {
      parentName: "Đỗ Văn Lâm",
      phone: "0978901234"
    },
    healthIndices: {
      height: 170,
      weight: 65,
      bmi: 22.5,
      bloodPressure: "115/75",
      vision: "7/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng hải sản",
      chronicDiseases: "Viêm xoang",
      medicalHistory: "Đã phẫu thuật viêm ruột thừa năm 2023"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-12",
        content: "Học sinh cần kiểm tra thị lực và làm thêm xét nghiệm máu.",
        author: "Y tá Ngọc"
      }
    ],
    healthRecords: [
      {
        date: "2024-11-12",
        height: 168,
        weight: 62,
        bmi: 22.0
      },
      {
        date: "2025-05-12",
        height: 170,
        weight: 65,
        bmi: 22.5
      }
    ]
  },
  {
    id: "SV008",
    name: "Ngô Thị Mai",
    class: "12A3",
    dateOfBirth: "2006-11-05",
    gender: "Nữ",
    bloodType: "AB-",
    lastUpdated: "2025-04-25",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=20",
    emergencyContact: {
      parentName: "Ngô Văn Nam",
      phone: "0989012345"
    },
    healthIndices: {
      height: 165,
      weight: 53,
      bmi: 19.5,
      bloodPressure: "110/70",
      vision: "10/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng phấn hoa",
      chronicDiseases: "Không",
      medicalHistory: "Tiêm ngừa đầy đủ"
    },
    notes: [
      {
        id: 1,
        date: "2025-04-25",
        content: "Học sinh có sức khỏe tốt. Đã tư vấn cách phòng ngừa dị ứng theo mùa.",
        author: "Y tá Linh"
      }
    ],
    healthRecords: [
      {
        date: "2024-10-25",
        height: 164,
        weight: 51,
        bmi: 19.0
      },
      {
        date: "2025-04-25",
        height: 165,
        weight: 53,
        bmi: 19.5
      }
    ]
  },
  {
    id: "SV009",
    name: "Lý Văn Phong",
    class: "9A1",
    dateOfBirth: "2009-04-18",
    gender: "Nam",
    bloodType: "O+",
    lastUpdated: "2025-05-18",
    status: "Đã hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=15",
    emergencyContact: {
      parentName: "Lý Thị Quỳnh",
      phone: "0990123456"
    },
    healthIndices: {
      height: 162,
      weight: 54,
      bmi: 20.6,
      bloodPressure: "115/75",
      vision: "9/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Không",
      chronicDiseases: "Không",
      medicalHistory: "Không có bệnh lý đặc biệt"
    },
    notes: [
      {
        id: 1,
        date: "2025-05-18",
        content: "Học sinh có sức khỏe tốt. Đã tư vấn về chế độ dinh dưỡng phù hợp với lứa tuổi.",
        author: "Y tá Hà"
      }
    ],
    healthRecords: [
      {
        date: "2024-11-18",
        height: 160,
        weight: 50,
        bmi: 19.5
      },
      {
        date: "2025-05-18",
        height: 162,
        weight: 54,
        bmi: 20.6
      }
    ]
  },
  {
    id: "SV010",
    name: "Trịnh Thị Rubi",
    class: "8B2",
    dateOfBirth: "2010-10-22",
    gender: "Nữ",
    bloodType: "A+",
    lastUpdated: "2025-04-30",
    status: "Chưa hoàn thành",
    avatar: "https://i.pravatar.cc/150?img=25",
    emergencyContact: {
      parentName: "Trịnh Văn Sơn",
      phone: "0901234567"
    },
    healthIndices: {
      height: 155,
      weight: 47,
      bmi: 19.6,
      bloodPressure: "105/65",
      vision: "8/10",
      hearing: "Bình thường"
    },
    medicalHistory: {
      allergies: "Dị ứng thời tiết",
      chronicDiseases: "Không",
      medicalHistory: "Đã tiêm ngừa đầy đủ"
    },
    notes: [
      {
        id: 1,
        date: "2025-04-30",
        content: "Học sinh cần bổ sung giấy xác nhận tiêm chủng mới nhất.",
        author: "Y tá Ngọc"
      }
    ],
    healthRecords: [
      {
        date: "2024-10-30",
        height: 152,
        weight: 45,
        bmi: 19.5
      },
      {
        date: "2025-04-30",
        height: 155,
        weight: 47,
        bmi: 19.6
      }
    ]
  }
];

// Phân loại BMI
const calculateBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: "Gầy", color: "#FFA500" };
  if (bmi >= 18.5 && bmi < 25) return { category: "Bình thường", color: "#4CAF50" };
  if (bmi >= 25 && bmi < 30) return { category: "Thừa cân", color: "#FF9800" };
  return { category: "Béo phì", color: "#F44336" };
};

// Chuẩn BMI theo độ tuổi cho trẻ em và thiếu niên
const getBMIStandardByAgeGender = (age, gender) => {
  const standards = {
    male: {
      8: { min: 14.0, max: 18.0 },
      9: { min: 14.2, max: 18.6 },
      10: { min: 14.5, max: 19.3 },
      11: { min: 14.9, max: 20.2 },
      12: { min: 15.4, max: 21.0 },
      13: { min: 16.0, max: 21.9 },
      14: { min: 16.6, max: 22.7 },
      15: { min: 17.2, max: 23.4 },
      16: { min: 17.8, max: 24.2 },
      17: { min: 18.4, max: 24.9 },
      18: { min: 18.5, max: 24.9 }
    },
    female: {
      8: { min: 13.8, max: 18.3 },
      9: { min: 14.0, max: 19.0 },
      10: { min: 14.2, max: 19.8 },
      11: { min: 14.6, max: 20.7 },
      12: { min: 15.0, max: 21.6 },
      13: { min: 15.5, max: 22.5 },
      14: { min: 16.0, max: 23.3 },
      15: { min: 16.4, max: 24.0 },
      16: { min: 16.8, max: 24.5 },
      17: { min: 17.1, max: 24.9 },
      18: { min: 17.5, max: 24.9 }
    }
  };

  const genderKey = gender.toLowerCase() === "nam" ? "male" : "female";
  
  if (age < 8) return standards[genderKey][8];
  if (age > 18) return standards[genderKey][18];
  return standards[genderKey][age];
};

// Lấy danh sách tất cả học sinh
const getAllStudents = () => {
  return Promise.resolve(studentsData);
};

// Lấy chi tiết một học sinh dựa vào ID
const getStudentById = (studentId) => {
  const student = studentsData.find(student => student.id === studentId);
  if (student) {
    return Promise.resolve(student);
  }
  return Promise.reject(new Error("Không tìm thấy học sinh với ID đã cho"));
};

// Tìm kiếm học sinh theo các điều kiện
const searchStudents = (criteria) => {
  let results = [...studentsData];
  
  if (criteria.keyword) {
    const keyword = criteria.keyword.toLowerCase();
    results = results.filter(student => 
      student.name.toLowerCase().includes(keyword) || 
      student.id.toLowerCase().includes(keyword)
    );
  }
  
  if (criteria.class) {
    results = results.filter(student => 
      student.class.includes(criteria.class)
    );
  }
  
  if (criteria.bloodType) {
    results = results.filter(student => 
      student.bloodType === criteria.bloodType
    );
  }
  
  if (criteria.healthIssue) {
    const keyword = criteria.healthIssue.toLowerCase();
    results = results.filter(student => 
      student.medicalHistory.allergies.toLowerCase().includes(keyword) || 
      student.medicalHistory.chronicDiseases.toLowerCase().includes(keyword) || 
      student.medicalHistory.medicalHistory.toLowerCase().includes(keyword)
    );
  }
    // Removed status filter
  
  return Promise.resolve(results);
};

// Cập nhật thông tin học sinh
const updateStudentRecord = (studentId, updateData) => {
  const index = studentsData.findIndex(student => student.id === studentId);
  
  // Nếu học sinh đã tồn tại, cập nhật thông tin
  if (index !== -1) {
    // Cập nhật BMI nếu có dữ liệu chiều cao và cân nặng
    if (updateData.healthIndices?.height && updateData.healthIndices?.weight) {
      const height = updateData.healthIndices.height / 100; // Chuyển từ cm sang m
      const weight = updateData.healthIndices.weight;
      updateData.healthIndices.bmi = parseFloat((weight / (height * height)).toFixed(1));
    }
    
    // Cập nhật ngày cập nhật gần nhất
    updateData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Thêm bản ghi sức khỏe mới nếu có dữ liệu chiều cao và cân nặng
    if (updateData.healthIndices?.height && updateData.healthIndices?.weight) {
      const newRecord = {
        date: updateData.lastUpdated,
        height: updateData.healthIndices.height,
        weight: updateData.healthIndices.weight,
        bmi: updateData.healthIndices.bmi
      };
      
      if (!studentsData[index].healthRecords) {
        studentsData[index].healthRecords = [];
      }
      
      studentsData[index].healthRecords.push(newRecord);
    }
    
    // Cập nhật dữ liệu học sinh
    studentsData[index] = {
      ...studentsData[index],
      ...updateData,
      healthIndices: {
        ...studentsData[index].healthIndices,
        ...updateData.healthIndices
      },
      medicalHistory: {
        ...studentsData[index].medicalHistory,
        ...updateData.medicalHistory
      }
    };
    
    return Promise.resolve(studentsData[index]);
  } 
  // Nếu học sinh chưa tồn tại, tạo mới
  else {
    // Kiểm tra xem có trùng ID không
    if (studentsData.some(student => student.id === studentId)) {
      return Promise.reject(new Error("Mã học sinh đã tồn tại"));
    }
    
    // Tạo cấu trúc mặc định cho học sinh mới
    const newStudent = {
      id: studentId,
      name: updateData.name || 'Chưa có tên',
      class: updateData.class || 'Chưa phân lớp',
      homeRoomTeacher: updateData.homeRoomTeacher || 'Chưa phân công',
      dateOfBirth: updateData.dateOfBirth || new Date().toISOString().split('T')[0],
      gender: updateData.gender || 'Nam',
      bloodType: updateData.bloodType || 'Chưa xác định',
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Đã hoàn thành',
      avatar: updateData.imageUrl || "https://via.placeholder.com/150",
      imageUrl: updateData.imageUrl || "",
      emergencyContact: updateData.emergencyContact || {
        parentName: "Chưa cập nhật",
        phone: "Chưa cập nhật"
      },
      healthIndices: updateData.healthIndices || {
        height: '',
        weight: '',
        bmi: '',
        bloodPressure: '',
        vision: '',
        hearing: ''
      },
      medicalHistory: updateData.medicalHistory || {
        allergies: '',
        chronicDiseases: '',
        medicalHistory: ''
      },
      notes: updateData.notes || [],
      healthRecords: []
    };
    
    // Thêm bản ghi sức khỏe mới nếu có dữ liệu chiều cao và cân nặng
    if (updateData.healthIndices?.height && updateData.healthIndices?.weight) {
      const height = updateData.healthIndices.height / 100; // Chuyển từ cm sang m
      const weight = updateData.healthIndices.weight;
      const bmi = parseFloat((weight / (height * height)).toFixed(1));
      
      newStudent.healthIndices.bmi = bmi;
      
      newStudent.healthRecords.push({
        date: newStudent.lastUpdated,
        height: updateData.healthIndices.height,
        weight: updateData.healthIndices.weight,
        bmi: bmi
      });
    }
    
    // Thêm học sinh mới vào danh sách
    studentsData.push(newStudent);
    return Promise.resolve(newStudent);
  }
};

// Thêm ghi chú cho học sinh
const addStudentNote = (studentId, note) => {
  const index = studentsData.findIndex(student => student.id === studentId);
  
  if (index !== -1) {
    const newNote = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content: note.content,
      author: note.author
    };
    
    if (!studentsData[index].notes) {
      studentsData[index].notes = [];
    }
    
    studentsData[index].notes.push(newNote);
    return Promise.resolve(studentsData[index]);
  }
  
  return Promise.reject(new Error("Không tìm thấy học sinh với ID đã cho"));
};

// Lấy các lớp học hiện có
const getClassList = () => {
  const classes = [...new Set(studentsData.map(student => student.class))];
  return Promise.resolve(classes);
};

// Lấy các nhóm máu hiện có
const getBloodTypes = () => {
  const bloodTypes = [...new Set(studentsData.map(student => student.bloodType))];
  return Promise.resolve(bloodTypes);
};

export {
  getAllStudents,
  getStudentById,
  searchStudents,
  updateStudentRecord,
  addStudentNote,
  getClassList,
  getBloodTypes,
  calculateBMICategory,
  getBMIStandardByAgeGender
};
