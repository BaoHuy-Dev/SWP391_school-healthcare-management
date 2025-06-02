import React from "react";

export default function FeatureCard({
  title,
  description,
  image,
  icon,
  index,
}) {
  return (
    <div
      className="feature-card"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="feature-icon-wrapper">
        {icon ? <i className={icon}></i> : <img src={image} alt={title} />}
      </div>
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <a href="#" className="feature-learn-more">
          Tìm hiểu thêm <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
}
