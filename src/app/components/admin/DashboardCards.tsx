// components/admin/DashboardCards.tsx
'use client';

import React from 'react';
import { FaUsers, FaVideo, FaCheckCircle, FaUserShield, FaCrown, FaGift } from "react-icons/fa";

interface DashboardData {
  users?: number;
  courses?: number;
  frees?: number;
  paids?: number;
  admins?: any[];
  completedCourses?: number;
  videoAndTextCourses?: number;
  textAndImageCourses?: number;
}

interface DashboardCardsProps {
  datas: DashboardData;
  loading: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ datas, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: datas.users || 0,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Courses',
      value: datas.courses || 0,
      icon: FaVideo,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Completed Courses',
      value: datas.completedCourses || 0,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Admin Users',
      value: datas.admins?.length || 0,
      icon: FaUserShield,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Paid Users',
      value: datas.paids || 0,
      icon: FaCrown,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Free Users',
      value: datas.frees || 0,
      icon: FaGift,
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
  ];

  return (
    <div className='flex flex-col'>
      <div className='my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <h5 className='text-sm font-medium tracking-tight text-gray-600 dark:text-gray-400 mb-3'>
                {stat.title}
              </h5>
              <div className='flex items-center gap-4'>
                <div className={`p-3 rounded-lg ${stat.bgColor} transition-transform group-hover:scale-110`}>
                  <Icon className={`text-2xl ${stat.textColor}`} />
                </div>
                <p className='font-black text-3xl text-black dark:text-white'>
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {datas.videoAndTextCourses !== undefined && datas.textAndImageCourses !== undefined && (
        <div className="mt-4 p-6 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Course Types Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video & Text</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{datas.videoAndTextCourses}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Text & Image</span>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{datas.textAndImageCourses}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;