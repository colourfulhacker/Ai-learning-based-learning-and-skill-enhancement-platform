'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHead from "../../../components/admin/AdminHead";
import axiosInstance from "../../../../lib/axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaTrash, FaGithub, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  email: string;
  completed: boolean;
  github_url?: string;
  video_url?: string;
  approve: 'pending' | 'accepted' | 'rejected';
  dateCreated: string;
}

const ProjectManagementPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/admin/projects' : `/api/admin/projects?status=${filter}`;
      const response = await axiosInstance.get(url);
      const data = response.data as { success: boolean; projects: Project[] };
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId: string, status: 'accepted' | 'rejected') => {
    try {
      setActionLoading(projectId);
      const response = await axiosInstance.patch('/api/admin/projects', {
        projectId,
        approve: status
      });
      
      const data = response.data as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        fetchProjects();
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setActionLoading(projectId);
      const response = await axiosInstance.delete(`/api/admin/projects?id=${projectId}`);
      const data = response.data as { success: boolean; message: string };
      
      if (data.success) {
        toast.success(data.message);
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      intermediate: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[difficulty.toLowerCase() as keyof typeof colors] || colors.beginner;
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHead />
        <main className="p-4">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-black dark:text-white">Project Management</h2>
            
            <div className="flex gap-2">
              {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No projects found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-black dark:text-white">{project.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(project.approve)}`}>
                          {project.approve}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBadge(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <span>👤 {project.email}</span>
                        <span>⏱️ {project.time}</span>
                        <span>📅 {new Date(project.dateCreated).toLocaleDateString()}</span>
                        {project.completed && <span className="text-green-600 dark:text-green-400">✅ Completed</span>}
                      </div>
                      
                      {(project.github_url || project.video_url) && (
                        <div className="flex gap-3 mt-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                              <FaGithub /> GitHub
                            </a>
                          )}
                          {project.video_url && (
                            <a
                              href={project.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition"
                            >
                              <FaYoutube /> Video
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {project.approve !== 'accepted' && (
                        <button
                          onClick={() => handleApprove(project._id, 'accepted')}
                          disabled={actionLoading === project._id}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {project.approve !== 'rejected' && (
                        <button
                          onClick={() => handleApprove(project._id, 'rejected')}
                          disabled={actionLoading === project._id}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(project._id)}
                        disabled={actionLoading === project._id}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectManagementPage;
