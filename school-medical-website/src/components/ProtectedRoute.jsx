import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect người dùng đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền truy cập
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect nếu không có quyền truy cập
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
