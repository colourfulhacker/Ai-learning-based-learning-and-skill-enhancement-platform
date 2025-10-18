'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHead from "../../../components/admin/AdminHead";
import axiosInstance from "../../../../lib/axios";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

interface User {
  _id: string;
  email: string;
  mName: string;
  uid: string;
  role: string;
  type: string;
  verified: boolean;
  profile?: string;
  stats: {
    courses: number;
    projects: number;
  };
}

const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/admin/users' : `/api/admin/users?role=${filter}`;
      const response = await axiosInstance.get(url);
      const data = response.data as { success: boolean; users: User[] };
      
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      setActionLoading(userId);
      const response = await axiosInstance.patch('/api/admin/users', {
        userId,
        updates
      });
      
      const data = response.data as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
        setEditingUser(null);
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user and all associated data?')) return;
    
    try {
      setActionLoading(userId);
      const response = await axiosInstance.delete(`/api/admin/users?id=${userId}`);
      const data = response.data as { success: boolean; message: string };
      
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
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
            <h2 className="text-2xl font-bold text-black dark:text-white">User Management</h2>
            
            <div className="flex gap-2">
              {(['all', 'admin', 'user'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-2 rounded-lg font-bold capitalize transition ${
                    filter === role
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {role}s
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Verified</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Stats</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile && (
                            <img
                              src={user.profile}
                              alt={user.mName}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-bold text-black dark:text-white">{user.mName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUser(user._id, { role: e.target.value })}
                          disabled={actionLoading === user._id}
                          className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-bold"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.type}
                          onChange={(e) => handleUpdateUser(user._id, { type: e.target.value })}
                          disabled={actionLoading === user._id}
                          className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-bold"
                        >
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleUpdateUser(user._id, { verified: !user.verified })}
                          disabled={actionLoading === user._id}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.verified
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {user.verified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>📚 {user.stats.courses} courses</div>
                        <div>🚀 {user.stats.projects} projects</div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={actionLoading === user._id}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
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

export default UsersManagementPage;
