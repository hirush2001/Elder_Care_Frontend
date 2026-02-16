import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { AiOutlineCheck, AiOutlineClose, AiOutlineClockCircle, AiOutlineDelete } from "react-icons/ai";
import { FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import ChatWidget from "../../components/chatwidget";
import CaregiverProfileForm from "./CareGiverProfile";

export default function CareGiverDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Caregiver";
  const token = localStorage.getItem("token");

  // Navigation
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data State
  const [requests, setRequests] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [caregiverProfile, setCaregiverProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Request filter tab (Pending/Accepted/Rejected)
  const [requestFilter, setRequestFilter] = useState("Pending");

  // Fetch Requests
  const fetchRequests = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched requests:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Accept Request
  const handleAcceptRequest = async (requestId) => {
    if (!requestId) return toast.error("Invalid request ID");

    // Update UI immediately (optimistic update)
    setRequests(prev => prev.map(req =>
      req.requestId === requestId ? { ...req, status: "Accepted" } : req
    ));
    setRequestFilter("Accepted");
    toast.success("Request accepted");

    try {
      // Save to server in background
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/elder/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
      // Revert UI change if server fails
      setRequests(prev => prev.map(req =>
        req.requestId === requestId ? { ...req, status: "Pending" } : req
      ));
      setRequestFilter("Pending");
    }
  };

  // Reject Request
  const handleRejectRequest = async (requestId) => {
    if (!requestId) return toast.error("Invalid request ID");

    // Update UI immediately (optimistic update)
    setRequests(prev => prev.map(req =>
      req.requestId === requestId ? { ...req, status: "Rejected" } : req
    ));
    setRequestFilter("Rejected");
    toast.error("Request rejected");

    try {
      // Save to server in background
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/elder/reject/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
      // Revert UI change if server fails
      setRequests(prev => prev.map(req =>
        req.requestId === requestId ? { ...req, status: "Pending" } : req
      ));
      setRequestFilter("Pending");
    }
  };

  // Delete Request
  const handleDeleteRequest = async (requestId) => {
    if (!requestId) return toast.error("Invalid request ID");

    // Confirm before deleting
    //if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      // Delete from server
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/request/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI after successful deletion
      setRequests(prev => prev.filter(req => req.requestId !== requestId));
      toast.success("Request deleted successfully");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error("Request not found");
      } else {
        toast.error("Failed to delete request");
      }
    }
  };

  // Fetch Profile
  const fetchCaregiverProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/guardian/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileImage(res.data.profilePicture);
      setCaregiverProfile(res.data);
      setShowProfile(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        navigate("/cprofile");
      } else {
        console.error(err);
        toast.error("Unable to load caregiver profile");
      }
    }
  };

  // Filtering
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const acceptedCount = requests.filter((r) => r.status === "Accepted").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const filteredRequests = requests.filter((r) => r.status === requestFilter);

  // Sidebar Navigation Item Component
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${activeTab === id
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-200">
            C
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">Caregiver<span className="text-green-600">Hub</span></h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
          <NavItem id="overview" icon={HiOutlineMenu} label="Overview" />
          <NavItem id="requests" icon={FaUsers} label="Elder Requests" />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <HiOutlineUserCircle className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">{userEmail}</p>
                <p className="text-xs text-gray-500">Caregiver</p>
              </div>
            </div>
            <button onClick={fetchCaregiverProfile} className="w-full text-xs font-medium text-green-600 hover:underline text-left">
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
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'requests' ? 'Elder Requests' : activeTab}
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
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Welcome back, {userEmail.split('@')[0]}! 👋</h1>
                      <p className="text-green-100 text-lg">Manage your elder care requests</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="text-sm text-green-100 mb-1">Total Requests</p>
                        <p className="text-4xl font-bold">{requests.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={AiOutlineClockCircle} label="Pending Requests" value={pendingCount} color="yellow" />
                  <StatCard icon={FaUserCheck} label="Accepted Requests" value={acceptedCount} color="green" />
                  <StatCard icon={FaUserTimes} label="Rejected Requests" value={rejectedCount} color="red" />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 text-xl mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => { setActiveTab('requests'); setRequestFilter('Pending'); }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-yellow-50 hover:bg-yellow-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <AiOutlineClockCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">View Pending</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('requests'); setRequestFilter('Accepted'); }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <FaUserCheck className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Accepted Elders</span>
                    </button>
                    <button
                      onClick={fetchCaregiverProfile}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <HiOutlineUserCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </button>
                  </div>
                </div>

                {/* Recent Requests Preview */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Recent Requests</h3>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-sm text-green-600 hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>
                  {requests.slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {requests.slice(0, 3).map((req) => (
                        <div key={req.requestId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                              req.status === 'Accepted' ? 'bg-green-100 text-green-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                              {req.status === 'Pending' ? <AiOutlineClockCircle className="w-5 h-5" /> :
                                req.status === 'Accepted' ? <FaUserCheck className="w-5 h-5" /> :
                                  <FaUserTimes className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{req.elder?.fullName || 'Elder'}</p>
                              <p className="text-xs text-gray-500">{req.elder?.email}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FaUsers className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No requests yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Elder Requests Section */}
            {activeTab === "requests" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Elder Care Requests</h2>
                    <p className="text-gray-500 mt-1">Manage your pending and accepted requests</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 border-b border-gray-200">
                  {["Pending", "Accepted", "Rejected"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-5 py-3 font-semibold transition relative ${requestFilter === tab
                        ? "text-gray-800 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                      onClick={() => setRequestFilter(tab)}
                    >
                      {tab}
                      {requestFilter === tab && (
                        <motion.div
                          layoutId="requestTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Request List */}
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <motion.div
                        key={req.requestId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <FaUsers className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg">{req.elder?.fullName || 'Elder'}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Email:</span> {req.elder?.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span> {req.elder?.contactNumber || 'N/A'}
                              </p>
                              {req.type && (
                                <p className="text-sm text-gray-500 mt-2">
                                  <span className="font-medium">Type:</span> {req.type} • {req.time}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {req.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleAcceptRequest(req.requestId)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all active:scale-95 font-medium"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.requestId)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <>
                                <span
                                  className={`px-4 py-2 rounded-xl text-white font-medium ${req.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                                    }`}
                                >
                                  {req.status}
                                </span>
                                <button
                                  onClick={() => handleDeleteRequest(req.requestId)}
                                  className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-xl shadow-lg hover:shadow-gray-400 transition-all active:scale-95"
                                  title="Delete request"
                                >
                                  <AiOutlineDelete className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                      <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-400 text-lg font-medium">No {requestFilter.toLowerCase()} requests</p>
                      <p className="text-sm text-gray-400 mt-2">Check back later for new elder care requests</p>
                    </div>
                  )}
                </div>
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
                <CaregiverProfileForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        
      </div>
    </div>
  );
}
