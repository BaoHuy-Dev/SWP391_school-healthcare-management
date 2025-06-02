import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import loginImage from "../assets/A1.jpg";
import googleIcon from "../assets/google.png"; // Thêm icon Google

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Xử lý đăng nhập bằng Google - sẽ thay thế bằng API thực tế
    alert("Chức năng đang được phát triển");
  };

  return (
    <div className="login-page">
      <div className="login-image-container">
        <img src={loginImage} alt="School Healthcare" className="login-image" />
        <div className="login-image-overlay">
          <h2>Chào mừng đến với</h2>
          <h1>HỆ THỐNG CHĂM SÓC SỨC KHỎE HỌC ĐƯỜNG</h1>
          <p>Cùng chăm sóc sức khỏe con em chúng ta</p>
        </div>
      </div>

      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-container">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="input-container">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="remember-forgot">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#forgot-password" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Phần đăng nhập bằng Google */}
          <div className="login-divider">
            <span>Hoặc đăng nhập bằng</span>
          </div>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <img src={googleIcon} alt="Google" />
            Đăng nhập với Google
          </button>

          <div className="login-footer">
            <p>
              Hỗ trợ:{" "}
              <a href="mailto:support@schoolhealth.edu.vn">
                support@schoolhealth.edu.vn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
