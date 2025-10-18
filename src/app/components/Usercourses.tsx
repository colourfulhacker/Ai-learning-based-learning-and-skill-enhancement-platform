"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";
import foundImg from "../assets/found.svg";
import Image from "next/image";
import { FaPlay, FaCheckCircle, FaClock } from "react-icons/fa";

interface Course {
  _id: string;
  photo: string;
  mainTopic: string;
  type: string;
  date: string;
  content: string;
  lang: string;
  completed: boolean;
  progress: number;
  end: string;
}

interface UserCoursesProps {
  userId: string | null;
}

const UserCourses: React.FC<UserCoursesProps> = ({ userId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [processing, setProcessing] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      setProcessing(false);
      return;
    }

    const fetchUserCourses = async () => {
      const postURL = `/api/courses?userId=${userId}`;
      try {
        const response = await axiosInstance.get<Course[]>(postURL);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching user courses:", error);
      } finally {
        setProcessing(false);
      }
    };

    fetchUserCourses();
  }, [userId]);

  function redirectGenerate() {
    router.push("/create");
  }

  const handleCourse = (
    content: string,
    mainTopic: string,
    type: string,
    lang: string,
    courseId: string,
    completed: boolean,
    end: string
  ) => {
    try {
      const jsonData = JSON.parse(content);
      sessionStorage.setItem("courseId", courseId);
      sessionStorage.setItem("first", String(completed));
      sessionStorage.setItem("lang", lang ? lang : "English");
      sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
      router.push(`/course/${courseId}`);
    } catch (error) {
      console.error("Failed to parse course content:", error);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'completed') return course.completed;
    if (filter === 'in-progress') return !course.completed;
    return true;
  });

  if (processing) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="my-4">
      {courses.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Image
            alt="Nothing found"
            src={foundImg}
            className="max-w-sm h-64 mb-6 opacity-50"
          />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            No Courses Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start your learning journey by creating your first course!
          </p>
          <button
            onClick={redirectGenerate}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            + Create Your First Course
          </button>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'in-progress', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-purple-600 dark:hover:border-purple-400'
                }`}
              >
                {f === 'in-progress' ? 'In Progress' : f}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={
                      course.photo && course.photo !== "default_image_url"
                        ? course.photo
                        : "/ai2.jpeg"
                    }
                    alt={course.mainTopic}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {course.completed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FaCheckCircle /> Completed
                    </div>
                  )}
                  {!course.completed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span className="font-medium">{course.progress || 0}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {course.mainTopic}
                  </h5>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md capitalize text-xs font-medium">
                      {course.type || 'Standard'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {new Date(course.date).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleCourse(
                        course.content,
                        course.mainTopic,
                        course.type,
                        course.lang,
                        course._id,
                        course.completed,
                        course.end
                      )
                    }
                    className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg group-hover:shadow-xl"
                  >
                    <FaPlay className="text-sm" />
                    {course.completed ? 'Review' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserCourses;
