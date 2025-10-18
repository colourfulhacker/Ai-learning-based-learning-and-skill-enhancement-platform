'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHead from "../../../components/admin/AdminHead";
import axiosInstance from "../../../../lib/axios";
import { toast } from "react-toastify";
import { FaTrash, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  mainTopic: string;
  subTopic: string;
  type: string;
  lang: string;
  progress: number;
  completed: boolean;
  date: string;
  end: string;
  userInfo: {
    email: string;
    mName: string;
  };
}

const CoursesManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/courses';
      if (filter === 'completed') url += '?completed=true';
      if (filter === 'in-progress') url += '?completed=false';
      
      const response = await axiosInstance.get(url);
      const data = response.data as { success: boolean; courses: Course[] };
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error("Failed to load courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      setActionLoading(courseId);
      const response = await axiosInstance.delete(`/api/admin/courses?id=${courseId}`);
      const data = response.data as { success: boolean; message: string };
      
      if (data.success) {
        toast.success(data.message);
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHead />
        <main className="p-4">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-black dark:text-white">Course Management</h2>
            
            <div className="flex gap-2">
              {(['all', 'in-progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-bold capitalize transition ${
                    filter === status
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No courses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Course</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Progress</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Started</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-black dark:text-white">{course.mainTopic}</p>
                          {course.subTopic && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{course.subTopic}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500">🌐 {course.lang}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-black dark:text-white">{course.userInfo.mName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{course.userInfo.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {course.type || 'Standard'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {course.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            course.completed
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}
                        >
                          {course.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(course.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/course/${course._id}`)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            title="View Course"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            disabled={actionLoading === course._id}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                            title="Delete Course"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursesManagementPage;
