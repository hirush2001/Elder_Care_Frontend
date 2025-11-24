import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUsers, FaTrash, FaUserCircle, FaUserShield, FaUserTie } from "react-icons/fa";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";

export default function CaregiversPage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Admin";
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: "" });

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.users || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Failed to fetch users");
      }
      setLoading(false);
    }
  };

  const openDeleteModal = (userId, userName) => {
    setDeleteModal({ show: true, userId, userName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, userId: null, userName: "" });
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.error("Please login to perform this action");
      closeDeleteModal();
      return;
    }

    const { userId } = deleteModal;
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("User deleted successfully");
      setUsers(users.filter(user => user.id !== userId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
      closeDeleteModal();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("elderId");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const guardianCount = users.filter(u => u.role === "Guardian").length;
  const caregiverCount = users.filter(u => u.role === "CareGiver").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <MdAdminPanelSettings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Caregiver Admin Dashboard</h1>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/guardiandashboard")}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              <FaUserCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-gray-500 text-sm mt-1">Registered accounts</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Guardians */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Guardians</h3>
                <p className="text-4xl font-bold text-gray-900">{guardianCount}</p>
                <p className="text-gray-500 text-sm mt-1">Active guardians</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <AiOutlineHeart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* CareGivers */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">CareGivers</h3>
                <p className="text-4xl font-bold text-gray-900">{caregiverCount}</p>
                <p className="text-gray-500 text-sm mt-1">Active caregivers</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <FaUserTie className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">User Management</h2>
            <p className="text-sm text-gray-600">Manage all system users and their permissions</p>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id || index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name || user.email.split('@')[0]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "Guardian"
                              ? "bg-blue-100 text-blue-700"
                              : user.role === "CareGiver"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(user.id, user.name || user.email)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ml-auto cursor-pointer"
                        >
                          <FaTrash className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteModal.userName}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}