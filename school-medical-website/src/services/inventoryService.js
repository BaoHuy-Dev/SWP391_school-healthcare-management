import axios from 'axios';

// Cấu hình sử dụng dữ liệu giả hay API thật
const config = {
  useMockData: true, // Mặc định sử dụng dữ liệu giả
  apiUrl: 'https://api.example.com/inventory' // URL API thật khi cần thay đổi
};

// Dữ liệu mẫu
const mockItems = [
  {
    id: 1,
    name: "Băng cá nhân",
    unit: "hộp",
    quantity: 20,
    category: "Vật tư y tế",
    expDate: "2025-12-31",
    warning: "Bình thường"
  },
  {
    id: 2,
    name: "Gạc vô trùng",
    unit: "gói",
    quantity: 15,
    category: "Vật tư y tế",
    expDate: "2025-06-30",
    warning: "Bình thường"
  },
  {
    id: 3,
    name: "Cồn y tế 70%",
    unit: "chai",
    quantity: 8,
    category: "Hóa chất",
    expDate: "2024-10-15",
    warning: "Thấp"
  },
  {
    id: 4,
    name: "Dung dịch sát khuẩn",
    unit: "chai",
    quantity: 5,
    category: "Hóa chất",
    expDate: "2024-08-20",
    warning: "Thấp"
  },
  {
    id: 5,
    name: "Nhiệt kế điện tử",
    unit: "cái",
    quantity: 10,
    category: "Thiết bị",
    expDate: null,
    warning: "Bình thường"
  },
  {
    id: 6,
    name: "Máy đo huyết áp",
    unit: "cái",
    quantity: 3,
    category: "Thiết bị",
    expDate: null,
    warning: "Bình thường"
  },
  {
    id: 7,
    name: "Paracetamol 500mg",
    unit: "vỉ",
    quantity: 25,
    category: "Thuốc",
    expDate: "2024-05-15",
    warning: "Cảnh báo"
  },
  {
    id: 8,
    name: "Dung dịch nhỏ mắt",
    unit: "chai",
    quantity: 12,
    category: "Thuốc",
    expDate: "2024-12-20",
    warning: "Bình thường"
  }
];

// Lưu trữ dữ liệu cục bộ
let items = [...mockItems];

// Lấy ID cao nhất hiện tại
const getHighestId = () => {
  return items.reduce((maxId, item) => Math.max(maxId, item.id), 0);
};

// Danh mục
const categories = ["Vật tư y tế", "Hóa chất", "Thiết bị", "Thuốc"];

// Delay giả lập
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Service API
const inventoryService = {
  // Lấy tất cả vật tư
  getAllItems: async () => {
    if (config.useMockData) {
      // Sử dụng dữ liệu giả
      await delay(300); // Giả lập độ trễ mạng
      return [...mockItems];
    } else {
      // Sử dụng API thật
      const response = await axios.get(config.apiUrl);
      return response.data;
    }
  },

  // Lấy một item theo ID
  getItemById: async (id) => {
    if (config.useMockData) {
      await delay(200);
      const item = mockItems.find(item => item.id === id);
      if (!item) throw new Error('Không tìm thấy vật tư');
      return { ...item };
    } else {
      const response = await axios.get(`${config.apiUrl}/${id}`);
      return response.data;
    }
  },

  // Thêm item mới
  addItem: async (item) => {
    if (config.useMockData) {
      await delay(400);
      const newItem = {
        ...item,
        id: Math.max(...mockItems.map(i => i.id), 0) + 1
      };
      mockItems.push(newItem);
      return { ...newItem };
    } else {
      const response = await axios.post(config.apiUrl, item);
      return response.data;
    }
  },

  // Cập nhật item
  updateItem: async (id, item) => {
    if (config.useMockData) {
      await delay(300);
      const index = mockItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Không tìm thấy vật tư');
      
      mockItems[index] = { ...item, id };
      return { ...mockItems[index] };
    } else {
      const response = await axios.put(`${config.apiUrl}/${id}`, item);
      return response.data;
    }
  },

  // Xóa item
  deleteItem: async (id) => {
    if (config.useMockData) {
      await delay(300);
      const index = mockItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Không tìm thấy vật tư');
      
      mockItems.splice(index, 1);
      return { success: true, id };
    } else {
      await axios.delete(`${config.apiUrl}/${id}`);
      return { success: true, id };
    }
  },

  // Tìm kiếm items theo trường và từ khóa
  searchItems: async (field, keyword) => {
    if (config.useMockData) {
      await delay(200);
      if (!keyword) return [...mockItems];
      
      return mockItems.filter(item => {
        const fieldValue = String(item[field]).toLowerCase();
        return fieldValue.includes(keyword.toLowerCase());
      });
    } else {
      const response = await axios.get(`${config.apiUrl}/search?field=${field}&keyword=${keyword}`);
      return response.data;
    }
  },

  // Lọc items theo danh mục
  filterByCategory: async (category) => {
    if (config.useMockData) {
      await delay(200);
      if (!category) return [...mockItems];
      return mockItems.filter(item => item.category === category);
    } else {
      const response = await axios.get(`${config.apiUrl}/category/${category}`);
      return response.data;
    }
  },

  // Lấy danh sách các danh mục
  getCategories: async () => {
    if (config.useMockData) {
      await delay(100);
      const categories = [...new Set(mockItems.map(item => item.category))];
      return categories;
    } else {
      const response = await axios.get(`${config.apiUrl}/categories`);
      return response.data;
    }
  },

  // Lấy các vật tư có số lượng thấp
  getLowStockItems: async () => {
    if (config.useMockData) {
      await delay(200);
      return mockItems.filter(item => item.warning === 'Thấp');
    } else {
      const response = await axios.get(`${config.apiUrl}/low-stock`);
      return response.data;
    }
  },

  // Xuất báo cáo
  exportReport: async () => {
    if (config.useMockData) {
      await delay(500);
      // Tạo dữ liệu giả cho báo cáo
      return {
        success: true,
        message: 'Xuất báo cáo thành công',
        reportUrl: '#'
      };
    } else {
      const response = await axios.get(`${config.apiUrl}/export`);
      return response.data;
    }
  },

  // Chuyển đổi giữa dữ liệu giả và API thật
  setUseMockData: (useMock) => {
    config.useMockData = useMock;
    return { success: true, useMockData: useMock };
  },

  // Cập nhật URL API
  setApiUrl: (url) => {
    if (url) {
      config.apiUrl = url;
      return { success: true, apiUrl: url };
    }
    return { success: false, message: 'URL không hợp lệ' };
  },

  // Lấy cấu hình hiện tại
  getConfig: () => {
    return { ...config };
  }
};

export default inventoryService;