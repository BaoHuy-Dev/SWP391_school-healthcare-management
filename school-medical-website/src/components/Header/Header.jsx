import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="header-nav">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/introduction" className="nav-link">
                Giới thiệu
              </Link>
            </li>
            <li>
              <a href="#guide" className="nav-link">
                Cẩm nang
              </a>
            </li>
            <li>
              <a href="#community" className="nav-link">
                Cộng đồng
              </a>
            </li>
            <li>
              <a href="#vaccination" className="nav-link">
                Lịch tiêm chủng
              </a>
            </li>
          </ul>

          <div className="header-actions">
            <a href="#appointment" className="appointment-btn">
              <i className="fas fa-calendar-alt"></i> Đặt lịch tư vấn
            </a>

            <a href="#notifications" className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </a>

            {currentUser ? (
              <div className="user-menu">
                <span className="user-greeting">
                  <i className="fas fa-user-circle"></i>
                  Xin chào, {currentUser.name}
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <i className="fas fa-sign-in-alt"></i> Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
