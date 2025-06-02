import React from "react";
import "./Vision.css";
// Import trực tiếp hình ảnh từ folder assets
import visionImage from "../../assets/vision.jpg";

export default function Vision() {
  const visionPoints = [
    {
      icon: "fa-solid fa-shield-heart",
      title: "Môi trường an toàn",
      description:
        "Xây dựng môi trường học tập an toàn, lành mạnh cho mọi học sinh",
    },
    {
      icon: "fa-solid fa-hand-holding-heart",
      title: "Chăm sóc toàn diện",
      description: "Hỗ trợ phát triển cả thể chất lẫn tinh thần của học sinh",
    },
    {
      icon: "fa-solid fa-people-group",
      title: "Kết nối cộng đồng",
      description:
        "Là cầu nối vững chắc giữa gia đình, nhà trường và cơ sở y tế",
    },
  ];

  return (
    <section className="vision section" id="vision">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tầm nhìn và sứ mệnh</h2>
          <div className="title-underline"></div>
        </div>

        <div className="vision-content">
          <div className="vision-text" data-aos="fade-right">
            <h2 className="vision-heading">
              Chăm sóc sức khỏe học đường - <span>Kiến tạo tương lai</span>
            </h2>

            <p className="vision-description">
              Đảm bảo môi trường học tập an toàn, lành mạnh và hỗ trợ tối đa cho
              sự phát triển thể chất lẫn tinh thần của học sinh. Thông qua việc
              theo dõi sức khỏe định kỳ, phát hiện sớm các vấn đề y tế, phối hợp
              chặt chẽ với phụ huynh và cơ sở y tế.
            </p>

            <div className="vision-points">
              {visionPoints.map((point, index) => (
                <div
                  className="vision-point"
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="point-icon">
                    <i className={point.icon}></i>
                  </div>
                  <div className="point-content">
                    <h3 className="point-title">{point.title}</h3>
                    <p className="point-description">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="vision-conclusion">
              Hệ thống y tế học đường không chỉ góp phần nâng cao chất lượng
              giáo dục mà còn xây dựng thói quen sống lành mạnh ngay từ lứa tuổi
              học sinh.
            </p>

          </div>

          <div className="vision-image-container" data-aos="fade-left">
            <img
              src={visionImage}
              alt="Tầm nhìn và sứ mệnh"
              className="vision-img"
            />
            <div className="vision-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-text">Học sinh</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-text">Giáo viên</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
