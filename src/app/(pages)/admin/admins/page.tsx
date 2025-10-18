'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHead from "../../../components/admin/AdminHead";
import axiosInstance from "../../../../lib/axios";
import { toast } from "react-toastify";
import { FaUserShield, FaTrash, FaUserMinus } from "react-icons/fa";

interface Admin {
  _id: string;
  email: string;
  mName: string;
  uid: string;
  profile?: string;
  stats: {
    courses: number;
    projects: number;
  };
}

const AdminsManagementPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [allUsers, setAllUsers] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const [adminsResponse, usersResponse] = await Promise.all([
        axiosInstance.get('/api/admin/users?role=admin'),
        axiosInstance.get('/api/admin/users?role=user')
      ]);
      
      const adminsData = adminsResponse.data as { success: boolean; users: Admin[] };
      const usersData = usersResponse.data as { success: boolean; users: Admin[] };
      
      if (adminsData.success && usersData.success) {
        setAdmins(adminsData.users);
        setAllUsers(usersData.users);
      } else {
        toast.error("Failed to load admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) {
      toast.warning("Please select a user");
      return;
    }
    
    try {
      setActionLoading(selectedUser);
      const response = await axiosInstance.patch('/api/admin/users', {
        userId: selectedUser,
        updates: { role: 'admin' }
      });
      
      const data = response.data as { success: boolean; message: string };
      if (data.success) {
        toast.success("User promoted to admin successfully");
        setShowAddModal(false);
        setSelectedUser('');
        fetchAdmins();
      } else {
        toast.error("Failed to promote user");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteAdmin = async (userId: string) => {
    if (!confirm('Are you sure you want to remove admin privileges from this user?')) return;
    
    try {
      setActionLoading(userId);
      const response = await axiosInstance.patch('/api/admin/users', {
        userId,
        updates: { role: 'user' }
      });
      
      const data = response.data as { success: boolean; message: string };
      if (data.success) {
        toast.success("Admin demoted to user successfully");
        fetchAdmins();
      } else {
        toast.error("Failed to demote admin");
      }
    } catch (error) {
      console.error("Error demoting admin:", error);
      toast.error("Failed to demote admin");
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
            <h2 className="text-2xl font-bold text-black dark:text-white">Admin Management</h2>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold hover:opacity-80 transition"
            >
              + Add Admin
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admins...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No admins found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {admin.profile ? (
                      <img
                        src={admin.profile}
                        alt={admin.mName}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <FaUserShield className="text-2xl text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-black dark:text-white">{admin.mName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>📚 {admin.stats.courses} courses</div>
                    <div>🚀 {admin.stats.projects} projects</div>
                  </div>
                  
                  <button
                    onClick={() => handleDemoteAdmin(admin._id)}
                    disabled={actionLoading === admin._id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                    <FaUserMinus /> Remove Admin
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Promote User to Admin</h3>
                
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg mb-4 text-black dark:text-white"
                >
                  <option value="">Select a user...</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.mName} ({user.email})
                    </option>
                  ))}
                </select>
                
                <div className="flex gap-3">
                  <button
                    onClick={handlePromoteToAdmin}
                    disabled={!selectedUser || actionLoading === selectedUser}
                    className="flex-1 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold hover:opacity-80 transition disabled:opacity-50"
                  >
                    {actionLoading === selectedUser ? 'Promoting...' : 'Promote'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedUser('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminsManagementPage;
