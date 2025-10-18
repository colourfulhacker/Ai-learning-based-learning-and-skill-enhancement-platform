'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footers from '../../components/Footers';
import UserCourses from '../../components/Usercourses';
import axiosInstance from "../../../lib/axios";
import { FaBook, FaChartLine, FaTrophy, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Stats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalProjects: number;
}

const HomePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = sessionStorage.getItem('uid');
    const name = sessionStorage.getItem('userName') || 'Student';
    setUserId(id);
    setUserName(name);

    if (id) {
      fetchDashboardData(id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (uid: string) => {
    try {
      const [coursesRes, projectsRes] = await Promise.all([
        axiosInstance.get(`/api/courses?userId=${uid}`),
        axiosInstance.get(`/api/projects?uid=${uid}`)
      ]);

      const courses = coursesRes.data as any[];
      const projects = projectsRes.data as any[];

      setStats({
        totalCourses: courses.length,
        completedCourses: courses.filter((c: any) => c.completed).length,
        inProgressCourses: courses.filter((c: any) => !c.completed).length,
        totalProjects: projects.length
      });

      sessionStorage.setItem("coursesCreatedToday", courses.length.toString());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950'>
      <Header isHome={true} />
      
      <div className='flex-1 container mx-auto px-4 py-8'>
        {/* Welcome Section */}
        <div className='mb-8 animate-fade-in'>
          <h1 className='text-4xl font-black text-gray-900 dark:text-white mb-2'>
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className='group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg transition-transform group-hover:scale-110'>
                <FaBook className='text-2xl text-blue-600 dark:text-blue-400' />
              </div>
              {loading ? (
                <div className='h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
              ) : (
                <span className='text-3xl font-black text-gray-900 dark:text-white'>
                  {stats.totalCourses}
                </span>
              )}
            </div>
            <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Courses</h3>
          </div>

          <div className='group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg transition-transform group-hover:scale-110'>
                <FaChartLine className='text-2xl text-yellow-600 dark:text-yellow-400' />
              </div>
              {loading ? (
                <div className='h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
              ) : (
                <span className='text-3xl font-black text-gray-900 dark:text-white'>
                  {stats.inProgressCourses}
                </span>
              )}
            </div>
            <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400'>In Progress</h3>
          </div>

          <div className='group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-green-100 dark:bg-green-900/20 rounded-lg transition-transform group-hover:scale-110'>
                <FaTrophy className='text-2xl text-green-600 dark:text-green-400' />
              </div>
              {loading ? (
                <div className='h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
              ) : (
                <span className='text-3xl font-black text-gray-900 dark:text-white'>
                  {stats.completedCourses}
                </span>
              )}
            </div>
            <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400'>Completed</h3>
          </div>

          <div className='group bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer' onClick={() => router.push('/create')}>
            <div className='flex items-center justify-center flex-col h-full'>
              <div className='p-3 bg-white/20 rounded-lg mb-3 transition-transform group-hover:scale-110'>
                <FaPlus className='text-2xl text-white' />
              </div>
              <h3 className='text-sm font-bold text-white text-center'>Create New Course</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mb-6 flex flex-wrap gap-3'>
          <button
            onClick={() => router.push('/create')}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg'
          >
            + New Course
          </button>
          <button
            onClick={() => router.push('/myproject')}
            className='px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-300 hover:scale-105'
          >
            My Projects
          </button>
          <button
            onClick={() => router.push('/performance')}
            className='px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300 hover:scale-105'
          >
            Performance
          </button>
        </div>

        {/* My Courses Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>My Courses</h2>
          </div>
          {userId ? <UserCourses userId={userId} /> : (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-solid border-purple-600 border-r-transparent'></div>
            </div>
          )}
        </div>
      </div>
      
      <Footers />
    </div>
  );
};

export default HomePage;
