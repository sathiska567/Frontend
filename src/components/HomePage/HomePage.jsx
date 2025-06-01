import React, { useEffect } from "react";
import HeaderSection from "../homepageComponents/HeaderSection/HeaderSection";
import AccelerateWorkSection from "../homepageComponents/AccelerateWorkSection/AccelerateWorkPage";
import FeaturesSection from "../homepageComponents/FeaturesSection/FeaturesSection";
import HowItWorkSection from "../homepageComponents/HowItWorkSection/HowItWorkSection";
import PricingSection from "../homepageComponents/PricingSection/PricingSection";
import FAQSection from "../homepageComponents/FAQSection/FAQSection";
import Cookies from 'js-cookie';

// Style for section with bottom border
const sectionStyle = {
  borderBottom: "1px solid #e5e7eb",
  width: "100%",
};

const HomePage = () => {

  useEffect(() => {
    const token = Cookies.get('token');
    // console.log("Token from cookie: ", token);
    localStorage.setItem('token', token);
  }, [])

  return (
    <div className="bg-white">
      <div style={sectionStyle}>
        <HeaderSection />
      </div>

      <div style={sectionStyle}>
        <AccelerateWorkSection />
      </div>

      <div style={sectionStyle} id="features">
        <FeaturesSection />
      </div>

      <div style={sectionStyle} id="how-it-works">
        <HowItWorkSection />
      </div>

      <div style={sectionStyle} id="pricing">
        <PricingSection />
      </div>

      <div style={sectionStyle} id="faq">
        <FAQSection />
      </div>
    </div>
  );
};

export default HomePage;
