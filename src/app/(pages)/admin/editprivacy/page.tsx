'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHead from "../../../components/admin/AdminHead";
import axiosInstance from "../../../../lib/axios";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";

const EditPrivacyPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/settings?type=privacy');
      const data = response.data as { success: boolean; content: string };
      
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error("Failed to load privacy policy");
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      toast.error("Failed to load privacy policy");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axiosInstance.post('/api/admin/settings', {
        type: 'privacy',
        content
      });
      
      const data = response.data as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error("Failed to save privacy policy");
      }
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      toast.error("Failed to save privacy policy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHead />
        <main className="p-4">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-black dark:text-white">Edit Privacy Policy</h2>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold hover:opacity-80 transition disabled:opacity-50"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading privacy policy...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter privacy policy here..."
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This content will be displayed on your Privacy Policy page.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditPrivacyPage;
