import React from "react";
import FeatureCard from "./FeatureCard";
import "./Features.css";

export default function Features() {
  const features = [
    {
      title: "Hồ sơ y tế thông minh",
      description:
        "Quản lý hồ sơ sức khỏe học sinh một cách thông minh và hiệu quả",
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/3XRakR8bTX.png",
      icon: "fa-regular fa-folder-medical",
    },
    {
      title: "Khám sức khỏe định kỳ",
      description: "Theo dõi và đánh giá sức khỏe học sinh thường xuyên",
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/mBvShg7Q5J.png",
      icon: "fa-solid fa-stethoscope",
    },
    {
      title: "Hỗ trợ tâm lý học đường",
      description: "Chăm sóc sức khỏe tinh thần và hỗ trợ tâm lý cho học sinh",
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/r8a6r80WOp.png",
      icon: "fa-solid fa-brain",
    },
    {
      title: "Quản lý bệnh nền",
      description: "Theo dõi và quản lý các bệnh lý mãn tính của học sinh",
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/hbdqWKebOu.png",
      icon: "fa-solid fa-clipboard-list",
    },
    {
      title: "Kết nối phụ huynh - nhà trường",
      description: "Tạo cầu nối thông tin y tế giữa gia đình và trường học",
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/o5FhUfLLbS.png",
      icon: "fa-solid fa-people-arrows",
    },
  ];

  return (
    <section className="features section" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            Khám phá các tính năng hiện đại giúp quản lý y tế học đường hiệu quả
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
