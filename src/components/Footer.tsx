"use client";

import React from "react";
import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 flex justify-center items-center z-50 space-y-2 space-x-4">
      <p className="text-sm md:text-base lg:text-lg font-semibold tracking-wide">
        Developed by&nbsp;
        <span className="hover:underline transition">Manurbhav Arya</span>
      </p>

      {/* Icons container */}
      <div className="flex items-center space-x-3">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/manurbhav-arya-647533247/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </a>

        {/* Email */}
        <a
          href="mailto:manurbhav.arya@rashmigroup.com"
          className="hover:text-blue-400 transition"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>
      </div>
    </footer>
  );
}
