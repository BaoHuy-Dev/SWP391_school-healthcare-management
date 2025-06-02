import React from "react";
import "./About.css";

export default function About() {
  const highlights = [
    {
      icon: "fa-solid fa-heart-pulse",
      title: "Kiểm tra sức khỏe định kỳ",
      description:
        "Theo dõi sự phát triển thể chất của học sinh thông qua các đợt kiểm tra sức khỏe chuyên nghiệp",
    },
    {
      icon: "fa-solid fa-apple-whole",
      title: "Tư vấn dinh dưỡng",
      description:
        "Hướng dẫn về chế độ ăn uống cân bằng và lành mạnh cho sự phát triển toàn diện",
    },
    {
      icon: "fa-solid fa-shield-virus",
      title: "Phòng ngừa bệnh tật",
      description:
        "Các biện pháp phòng ngừa và xử lý kịp thời đặc biệt trong mùa dịch bệnh",
    },
  ];

  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Về chúng tôi</h2>
          <div className="title-underline"></div>
        </div>

        <div className="about-content">
          <div className="about-image-container" data-aos="fade-right">
            <div className="about-image-wrapper">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/1FVuqEqGnf.png"
                alt="Chăm sóc sức khỏe toàn diện"
                className="about-img"
              />
              <div className="experience-badge">
                <span className="years">5+</span>
                <span className="text">Năm kinh nghiệm</span>
              </div>
            </div>
          </div>

          <div className="about-text" data-aos="fade-left">
            <h2 className="about-title">
              Chú trọng chăm sóc sức khỏe toàn diện cho học sinh
            </h2>

            <div className="about-description">
              <p>
                Chăm sóc sức khỏe toàn diện cho học sinh là một trong những mục
                tiêu Trường Tiểu học, Trung học Cơ sở và Trung học Phổ thông
                Dewey chú trọng hàng đầu, được duy trì song song với công tác
                giáo dục học sinh. Nhà trường có đội ngũ nhân viên y tế giàu
                kinh nghiệm và chuyên môn cao, luôn theo sát quá trình phát
                triển về thể chất của TDSers.
              </p>

              <div className="about-highlights">
                {highlights.map((item, index) => (
                  <div
                    className="highlight-item"
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="highlight-icon">
                      <i className={item.icon}></i>
                    </div>
                    <div className="highlight-content">
                      <h3 className="highlight-title">{item.title}</h3>
                      <p className="highlight-description">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p>
                Sự quan tâm toàn diện này chính là nền tảng giúp các em phát
                triển hài hòa cả thể chất lẫn tinh thần, sẵn sàng chinh phục
                những thử thách trong học tập và cuộc sống.
              </p>

              <a href="#learn-more" className="learn-more-btn">
                Tìm hiểu thêm <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="about-shape shape-1"></div>
      <div className="about-shape shape-2"></div>
    </section>
  );
}
