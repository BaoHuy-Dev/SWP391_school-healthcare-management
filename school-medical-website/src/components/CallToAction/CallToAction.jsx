import React from 'react';
import './CallToAction.css';

export default function CallToAction() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">
            Sức khỏe học sinh – Ưu tiên hàng đầu của nhà trường
          </h2>
          <p className="cta-description">
            Hãy thường xuyên theo dõi thông tin y tế của con em bạn để cùng
            nhà trường chăm sóc sức khỏe học sinh tốt hơn!
          </p>
          <a href="#contact" className="btn btn-primary cta-button">
            Liên hệ ngay
          </a>
        </div>
      </div>
    </section>
  );
}
