import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-primary rounded-lg px-6 md:px-10 lg:px-20 overflow-hidden">
      {/* ------Left Side--------- */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 md:py-16 lg:py-20">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img src={assets.group_profiles} alt="Profiles" className="w-28" />
          <p className="text-center md:text-left">
            Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block" />
            schedule your appointment now.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300"
        >
          Book appointment <img src={assets.arrow_icon} alt="Arrow" />
        </a>
      </div>

      {/* ------Right Side--------- */}
      <div className="md:w-1/2 relative">
        <div className="w-full h-full bg-primary flex justify-end items-center">
          <img
            src={assets.header_img}
            alt="Header Illustration"
            className="w-[90%] md:w-[85%] lg:w-[80%] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
