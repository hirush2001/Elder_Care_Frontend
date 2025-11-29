import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { FaUsers, FaUserCircle, FaUserTie } from "react-icons/fa";
import { FiLogOut, FiSearch, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { MdAdminPanelSettings } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import AdminProfileForm from "./AdminProfile";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Admin";
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/elder`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data || []);
      setShowProfile(true);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDelete = async (elderId) => {
    if (!elderId) return toast.error("Invalid elderId");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/elder/${elderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Successfully deleted ${elderId}`);
      fetchUsers(); // reload the users list
    } catch (err) {
      toast.error(`Failed to delete ${elderId}`);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const guardianCount = users.filter((u) => u.role === "elder").length;
  const caregiverCount = users.filter((u) => u.role === "caregiver").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/guardian/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdminProfile(res.data);
      setShowProfile(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No profile → go to create profile page
        navigate("/cprofile");
      } else {
        console.error(err);
        toast.error("Unable to load caregiver profile");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-8">

      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700">Admin Dashboard</h1>
          <p className="text-gray-500">{userEmail}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={fetchAdminProfile}
            className="cursor-pointer"
          >
            <HiOutlineUserCircle className="w-10 h-10" />
          </button>

          <button
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <HiOutlineLogout className="w-10 h-10" />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <FaUsers className="text-blue-600 w-10 h-10" />
          <h2 className="text-lg font-semibold text-blue-600">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <AiOutlineHeart className="text-green-600 w-10 h-10" />
          <h2 className="text-lg font-semibold text-green-600">Elders</h2>
          <p className="text-3xl font-bold mt-2">{guardianCount}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <FaUserTie className="text-orange-600 w-10 h-10" />
          <h2 className="text-lg font-semibold text-orange-600">Caregivers</h2>
          <p className="text-3xl font-bold mt-2">{caregiverCount}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <MdAdminPanelSettings className="text-purple-600 w-10 h-10" />
          <h2 className="text-lg font-semibold text-purple-600">Admins</h2>
          <p className="text-3xl font-bold mt-2">{adminCount}</p>
        </div>
      </div>

      {/* Search & User List */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-[90%] max-w-5xl space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* User Table */}
        <div>
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No users found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.elderId} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(user.elderId)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md transition flex items-center justify-center cursor-pointer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

{showProfile && (
              <div className="fixed inset-0 bg-black bg-opacity flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-4xl relative">
                      <button
                          onClick={() => setShowProfile(false)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold cursor-pointer"
                      >
                          ✕
            </button>
            <AdminProfileForm />
                  </div>
                  </div>
          )}
    </div>
  );
}
