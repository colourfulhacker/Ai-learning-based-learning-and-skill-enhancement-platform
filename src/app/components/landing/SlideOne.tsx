// components/landing/SlideOne.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import slide from "../../assets/slideOneNew.png";

const SlideOne: React.FC = () => {
  return (
    <div className="flex flex-col items-center dark:bg-black pt-0 pb-5 md:pt-10 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent dark:via-purple-900/10 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <h1 className="text-5xl max-lg:text-4xl max-md:text-3xl font-black text-center mt-10 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent animate-gradient-x">
          AI Learning Made Effortless: Earn Certifications, Land Your Dream Job,
          and Stay Ahead!
        </h1>
        
        <p className="text-center text-lg max-md:text-base text-gray-700 dark:text-gray-300 mt-6 max-w-3xl mx-auto font-medium leading-relaxed">
          Experience the Future of Learning with Our AI-Powered Platform. Generate personalized courses, 
          take interactive quizzes, and build real-world projects to accelerate your career.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
          <Link 
            href="/signin" 
            className="group relative px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-black dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </Link>
          
          <Link 
            href="/signup" 
            className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        <div className="flex justify-center items-center gap-8 mb-8 flex-wrap text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">AI-Powered Courses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Interactive Quizzes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Real Projects</span>
          </div>
        </div>
      </div>

      <Image
        src={slide}
        alt="AI Learning Platform Showcase"
        className="w-[70%] max-w-4xl relative z-10 transition-transform duration-500 hover:scale-105"
        placeholder="blur"
        priority
      />
    </div>
  );
};

export default SlideOne;