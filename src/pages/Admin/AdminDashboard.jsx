import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaUserTie } from "react-icons/fa";
import { FiLogOut, FiSearch, FiTrash2 } from "react-icons/fi";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { MdAdminPanelSettings, MdDashboard } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import AdminProfileForm from "./AdminProfile";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Admin";
  const token = localStorage.getItem("token");

  // Navigation
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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

    // Store user data for potential rollback
    const userToDelete = users.find(u => u.elderId === elderId);
    if (!userToDelete) return toast.error("User not found");

    // Remove from UI immediately
    setUsers(prev => prev.filter(u => u.elderId !== elderId));
    toast.success(`Successfully deleted user`);

    try {
      // Delete on server in background
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/elder/${elderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete user. Restoring...`);
      // Restore user on error
      setUsers(prev => [...prev, userToDelete]);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/guardian/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileImage(res.data.profilePicture);
      setAdminProfile(res.data);
      setShowProfile(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        navigate("/cprofile");
      } else {
        console.error(err);
        toast.error("Unable to load Admin profile");
      }
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

  // Sidebar Navigation Item Component
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${activeTab === id
        ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-8 bg-purple-600 rounded-r-full"
        />
      )}
    </button>
  );

  // Stats Card Component
  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className={`w-20 h-20 text-${color}-500`} />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center mb-4 text-${color}-600`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="fixed md:relative z-30 h-full bg-white border-r border-gray-100 shadow-xl md:shadow-none flex flex-col overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-200">
            A
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">Admin<span className="text-purple-600">Panel</span></h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
          <NavItem id="overview" icon={MdDashboard} label="Overview" />
          <NavItem id="users" icon={FaUsers} label="User Management" />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <HiOutlineUserCircle className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">{userEmail}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button onClick={fetchAdminProfile} className="w-full text-xs font-medium text-purple-600 hover:underline text-left">
              View Profile
            </button>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <HiOutlineLogout className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            >
              {isSidebarOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
            <h2 className="text-lg font-bold text-gray-800 capitalize">
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'users' ? 'User Management' : activeTab}
            </h2>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Overview Section */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Welcome back, {userEmail.split('@')[0]}! 👋</h1>
                      <p className="text-purple-100 text-lg">System administration and user management</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="text-sm text-purple-100 mb-1">Total Users</p>
                        <p className="text-4xl font-bold">{totalUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard icon={FaUsers} label="Total Users" value={totalUsers} color="blue" />
                  <StatCard icon={AiOutlineHeart} label="Elders (Guardians)" value={guardianCount} color="green" />
                  <StatCard icon={FaUserTie} label="Caregivers" value={caregiverCount} color="orange" />
                  <StatCard icon={MdAdminPanelSettings} label="Administrators" value={adminCount} color="purple" />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 text-xl mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <FaUsers className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Manage Users</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('users'); setSearchTerm('elder'); }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <AiOutlineHeart className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">View Elders</span>
                    </button>
                    <button
                      onClick={fetchAdminProfile}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <HiOutlineUserCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </button>
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Recent Users</h3>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="text-sm text-purple-600 hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>
                  {users.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.elderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user.role === 'elder' ? 'bg-green-100 text-green-600' :
                              user.role === 'caregiver' ? 'bg-orange-100 text-orange-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                              {user.role === 'elder' ? <AiOutlineHeart className="w-5 h-5" /> :
                                user.role === 'caregiver' ? <FaUserTie className="w-5 h-5" /> :
                                  <MdAdminPanelSettings className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'elder' ? 'bg-green-100 text-green-700' :
                            user.role === 'caregiver' ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                            {user.role === 'elder' ? 'Elder' : user.role === 'caregiver' ? 'Caregiver' : 'Admin'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FaUsers className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No users yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* User Management Section */}
            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage all system users and roles</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center text-gray-500">
                      <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p>Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <FaUsers className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-2">Try adjusting your search criteria</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <motion.tr
                              key={user.elderId}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'elder' ? 'bg-green-100 text-green-600' :
                                    user.role === 'caregiver' ? 'bg-orange-100 text-orange-600' :
                                      'bg-purple-100 text-purple-600'
                                    }`}>
                                    {user.role === 'elder' ? <AiOutlineHeart className="w-5 h-5" /> :
                                      user.role === 'caregiver' ? <FaUserTie className="w-5 h-5" /> :
                                        <MdAdminPanelSettings className="w-5 h-5" />}
                                  </div>
                                  <span className="font-medium text-gray-800">{user.fullName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'elder' ? 'bg-green-100 text-green-700' :
                                  user.role === 'caregiver' ? 'bg-orange-100 text-orange-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                  {user.role === 'elder' ? 'Elder' : user.role === 'caregiver' ? 'Caregiver' : 'Admin'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDelete(user.elderId)}
                                  className="inline-flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all active:scale-95"
                                  title="Delete User"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* User Count Footer */}
                {!loading && filteredUsers.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4 text-center text-sm text-gray-600">
                    Showing {filteredUsers.length} of {totalUsers} total users
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Your Profile</h3>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <AdminProfileForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
