import React from "react";
import "./index.css";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import About from "../../components/About/About";
import Vision from "../../components/Vision/Vision";
import CallToAction from "../../components/CallToAction/CallToAction";

export default function Main() {
  return (
    <>
      {/* Hero Section - Hiển thị banner chính */}
      <Hero />

      {/* Features Section - Hiển thị các tính năng nổi bật */}
      <Features />

      {/* About Section - Giới thiệu về dịch vụ */}
      <About />

      {/* Vision Section - Tầm nhìn và sứ mệnh */}
      <Vision />

      {/* Call to Action - Kêu gọi hành động */}
      <CallToAction />
    </>
  );
}
