'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaClock, FaCode } from 'react-icons/fa';

interface ProjectSuggestion {
  title: string;
  description: string;
  difficulty: string;
  time: string;
  skills: string[];
}

interface ProjectSuggestionsViewProps {
  courseId: string;
  courseTitle: string;
  userId: string;
  firebaseUId: string;
  userEmail: string;
}

const ProjectSuggestionsView: React.FC<ProjectSuggestionsViewProps> = ({ 
  courseId, 
  courseTitle,
  userId,
  firebaseUId,
  userEmail
}) => {
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/api/projects/suggest', { courseId });
        const data = response.data as { success: boolean; projects: ProjectSuggestion[] };
        if (data.success) {
          setProjects(data.projects);
        } else {
          toast.error('Failed to load project suggestions');
        }
      } catch (error: any) {
        console.error('Error loading project suggestions:', error);
        toast.error('Failed to load project suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [courseId]);

  const handleStartProject = async (project: ProjectSuggestion) => {
    try {
      setSaving(true);
      await axiosInstance.post('/api/projects', {
        projectTitle: project.title,
        description: project.description,
        difficulty: project.difficulty,
        time: project.time,
        userId,
        email: userEmail,
        firebaseUId
      });
      toast.success('Project added to your projects!');
    } catch (error: any) {
      console.error('Error starting project:', error);
      toast.error('Failed to add project');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'intermediate':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'advanced':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-black dark:text-white">No project suggestions available.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Project Suggestions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Apply your knowledge of {courseTitle} with these hands-on projects
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(project.difficulty)}`}>
                {project.difficulty}
              </span>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FaClock className="mr-1" size={14} />
                {project.time}
              </div>
            </div>

            <h3 className="text-xl font-bold text-black dark:text-white mb-3">
              {project.title}
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
              {project.description}
            </p>

            <div className="mb-4">
              <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaCode className="mr-2" />
                Skills you'll practice:
              </div>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartProject(project)}
              disabled={saving}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg font-bold hover:opacity-80 transition disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Start This Project'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSuggestionsView;
