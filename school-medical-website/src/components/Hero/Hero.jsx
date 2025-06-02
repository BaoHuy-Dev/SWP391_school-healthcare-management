import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hệ thống Quản lý Y tế Học đường
            </h1>
            <div className="hero-description">
              <h2 className="hero-subtitle">
                Vì sao nên chọn School Medical để quản lý y tế học đường?
              </h2>
              <p className="hero-paragraph">
                Khi sử dụng School Medical, nhà trường sẽ được trang bị một hệ
                thống hiện đại giúp theo dõi sức khỏe học sinh, quản lý hồ sơ y
                tế và xử lý các tình huống khẩn cấp một cách nhanh chóng, hiệu
                quả. Với giao diện thân thiện và công cụ quản lý thông minh, hệ
                thống đảm bảo mỗi học sinh đều được chăm sóc đúng lúc, đúng cách
                – dựa trên tiêu chí an toàn, chính xác và cá nhân hóa.
              </p>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/3nTekDHd9c.png" 
              alt="School Medical System"
              className="hero-img"
            />
            <div className="hero-card">
              <h3 className="card-title">
                Mọi thứ bắt đầu từ chăm sóc sức khỏe ban đầu
              </h3>
              <p className="card-text">
                Ngay tại trường học của bạn, hệ thống School Medical cung cấp
                các giải pháp chăm sóc sức khỏe học đường tiện lợi, hiện đại
                và chất lượng. Chúng tôi mang đến sự an tâm cho học sinh, phụ
                huynh và giáo viên thông qua dịch vụ y tế toàn diện, chuyên
                nghiệp và luôn sẵn sàng hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
