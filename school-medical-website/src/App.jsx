import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import MainPage from "./Pages/Parent/index";
import IntroductionPage from "./Pages/Parent/IntroductionPage";
import StudentProfile from "./Pages/Parent/StudentProfile";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import NurseDashboard from "./Pages/Nurse/NurseDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles/global.css";
import Footer from "./components/Footer/Footer";

// Thêm layout cho những trang có header, footer, navigation
const MainLayout = ({ children }) => (
  <>
    <Header />
    <Navigation />
    <main>{children}</main>
    <Footer />
  </>
);

// Layout riêng cho admin/y tá (có thể tùy chỉnh giao diện khác)
const AdminLayout = ({ children }) => (
  <div className="admin-layout">{children}</div>
);

function AppRoutes() {
  const { currentUser } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease",
    });
  }, []);

  // Hàm điều hướng dựa trên vai trò
  const redirectBasedOnRole = () => {
    if (!currentUser) return <Navigate to="/login" replace />;

    switch (currentUser.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "nurse":
        return <Navigate to="/nurse" replace />;
      case "parent":
        return <Navigate to="/parent" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Login page route - không có layout */}
      <Route
        path="/login"
        element={currentUser ? redirectBasedOnRole() : <Login />}
      />

      {/* Redirect trang chủ dựa trên vai trò */}
      <Route path="/" element={redirectBasedOnRole()} />

      {/* Trang chủ cho phụ huynh */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <MainLayout>
              <MainPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Trang chủ cho admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Trang chủ cho y tá */}
      <Route path="/nurse"
        element={
          <ProtectedRoute allowedRoles={["nurse"]}>
            <AdminLayout>
              <NurseDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Các routes chung */}
      <Route path="/introduction"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IntroductionPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-profile"
        element={
          <ProtectedRoute allowedRoles={["parent", "admin", "nurse"]}>
            <MainLayout>
              <StudentProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect mặc định về login page nếu chưa đăng nhập hoặc về homepage theo vai trò */}
      <Route path="*" element={redirectBasedOnRole()} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}