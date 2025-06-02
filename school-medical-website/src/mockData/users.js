export const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "Admin Hệ thống",
    role: "admin",
    email: "admin@school.edu.vn",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    username: "phuhuynh1",
    password: "123456",
    name: "Nguyễn Thị Minh",
    role: "parent",
    email: "minh@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    children: [
      {
        id: 101,
        name: "Lê Hoàng Anh",
        class: "10A1",
        dob: "2010-05-15",
        gender: "Nam",
        healthStatus: "Tốt"
      }
    ]
  },
  {
    id: 3,
    username: "phuhuynh2",
    password: "123456",
    name: "Trần Văn Đức",
    role: "parent",
    email: "duc@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    children: [
      {
        id: 102,
        name: "Trần Minh Châu",
        class: "11A2",
        dob: "2009-02-20",
        gender: "Nữ",
        healthStatus: "Tốt"
      },
      {
        id: 103,
        name: "Trần Minh Hiếu",
        class: "7B1",
        dob: "2013-11-10",
        gender: "Nam",
        healthStatus: "Cần theo dõi"
      }
    ]
  },
  {
    id: 4,
    username: "yta1",
    password: "123456",
    name: "Lê Thị Hương",
    role: "nurse",
    email: "huong@school.edu.vn",
    avatar: "https://i.pravatar.cc/150?img=9",
    specialization: "Y tá chính",
    workingYears: 5
  }
];

// Hàm mô phỏng API call đăng nhập
export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    // Giả lập độ trễ của mạng
    setTimeout(() => {
      const user = mockUsers.find(
        (user) => user.username === username && user.password === password
      );
      
      if (user) {
        // Không trả về mật khẩu
        const { password, ...userWithoutPassword } = user;
        
        resolve({
          success: true,
          data: {
            user: userWithoutPassword,
            token: `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`
          }
        });
      } else {
        reject({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không chính xác"
        });
      }
    }, 800); // Độ trễ 800ms để giả lập network request
  });
};