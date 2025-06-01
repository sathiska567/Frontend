import React from "react";
import AccelerateWorkSection from "./AccelerateWorkSection";
import UserReviewSection from "./UserReviewSection";
import DemoAndStat from "./DemoAndStat";

const AccelerateWorkPage = () => {
  return (
    <div className="flex flex-col w-full">
      <section className="border-b border-gray-200">
        <AccelerateWorkSection />
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <UserReviewSection />
      </section>

      <section className="border-t border-gray-200 mt-10">
        <DemoAndStat />
      </section>
    </div>
  );
};

export default AccelerateWorkPage;
