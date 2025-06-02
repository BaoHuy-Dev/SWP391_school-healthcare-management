import React from "react";
// import "../styles/IntroductionPage.css";

export default function IntroductionPage() {
  return (
    <div className="introduction-page">
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Giới thiệu</h1>
        </div>
      </div>

      <div className="container introduction-content">
        <div className="intro-section" data-aos="fade-up">
          <h2>Về chúng tôi</h2>
          <p>
            Hệ thống chăm sóc sức khỏe học đường của Trường Tiểu học, Trung học
            Cơ sở và Trung học Phổ thông Dewey được thiết lập với mục tiêu đảm
            bảo sức khỏe toàn diện cho học sinh, tạo nền tảng vững chắc cho sự
            phát triển học tập và rèn luyện.
          </p>
          <p>
            Với đội ngũ y tế giàu kinh nghiệm và hệ thống thiết bị hiện đại,
            chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
            kịp thời và toàn diện cho tất cả học sinh.
          </p>
        </div>

        <div className="intro-section" data-aos="fade-up">
          <h2>Lịch sử hình thành</h2>
          <p>
            Được thành lập từ năm 2015, hệ thống y tế học đường của trường đã
            không ngừng phát triển và hoàn thiện. Trải qua hơn 8 năm hoạt động,
            chúng tôi đã xây dựng được quy trình chăm sóc sức khỏe học sinh
            chuyên nghiệp và hiệu quả.
          </p>
          <p>
            Với sự hỗ trợ từ các chuyên gia y tế hàng đầu và công nghệ quản lý
            hiện đại, hệ thống của chúng tôi luôn được cập nhật và đáp ứng các
            tiêu chuẩn cao nhất về y tế học đường.
          </p>
        </div>

        <div className="intro-section" data-aos="fade-up">
          <h2>Tầm nhìn và sứ mệnh</h2>
          <p>
            <strong>Tầm nhìn:</strong> Trở thành hệ thống chăm sóc sức khỏe học
            đường hàng đầu, đi đầu trong áp dụng công nghệ và phương pháp tiên
            tiến để nâng cao sức khỏe và phòng ngừa bệnh tật cho học sinh.
          </p>
          <p>
            <strong>Sứ mệnh:</strong> Chăm sóc, theo dõi và bảo vệ sức khỏe học
            sinh; Phát hiện sớm các vấn đề sức khỏe; Giáo dục và xây dựng thói
            quen sống lành mạnh; Tạo môi trường an toàn và thân thiện cho việc
            học tập và phát triển.
          </p>
        </div>
      </div>
    </div>
  );
}
