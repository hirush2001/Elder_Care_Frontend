import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import ChatWidget from "../../components/chatwidget";
import ElderProfileForm from "./ElderProfileList";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guardian";
  const token = localStorage.getItem("token");

  // Navigation
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data State
  const [healthRecords, setHealthRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [elders, setElders] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Health Record inputs
  const [bloodPressure, setBloodPressure] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  const [temperature, setTemperature] = useState("");

  // Reminder inputs
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  // Fetch health records, reminders, caregivers
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/health/records`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHealthRecords(res.data.records || []))
      .catch((err) => console.error("Error fetching health records:", err));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/medical/getmed`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReminders(res.data.records || []))
      .catch((err) => console.error("Error fetching reminders:", err));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/elder`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.eldrs;
        if (!data) {
          console.warn("Unexpected response:", res.data);
          setElders([]);
          return;
        }
        const caregivers = data.filter((item) => item.role === "caregiver");
        setElders(caregivers);
      })
      .catch((err) => {
        console.error("Error fetching caregivers:", err);
        toast.error("Failed to load caregivers");
        setElders([]);
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/profile/guardian/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfileImage(res.data.profilePicture);
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  }

  function handleAddHealthRecord() {
    if (!token) return toast.error("Not authenticated");

    const recordData = {
      bloodPressure,
      sugarLevel,
      pulseRate,
      temperature,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/health/record`, recordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message || "Health record added successfully");
        setHealthRecords((prev) => [...prev, res.data.record]);
        setBloodPressure("");
        setSugarLevel("");
        setPulseRate("");
        setTemperature("");
      })
      .catch((err) => {
        console.error("Error adding health record:", err);
        toast.error(
          err.response?.data?.message || "Failed to add health record"
        );
      });
  }

  function handleAddReminder() {
    if (!token) return toast.error("Not authenticated");

    const reminderData = {
      medicineName,
      dosage,
      time,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/medical/addmedicine`, reminderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Reminder added successfully");
        setReminders((prev) => [...prev, reminderData]);
        setMedicineName("");
        setDosage("");
        setTime("");
      })
      .catch((err) => {
        console.error("Error adding reminder:", err);
        toast.error(err.response?.data?.message || "Failed to add reminder");
      });
  }

  function handleAddRequest(care_taker_id) {
    if (!care_taker_id) return toast.error("Invalid caregiver ID");

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/request/${care_taker_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success(res.data || "Caregiver request sent successfully");
      })
      .catch((err) => {
        console.error("Error sending caregiver request:", err);
        toast.error(
          err.response?.data?.message || "Failed to send caregiver request"
        );
      });
  }

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
  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            G
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">Guardian<span className="text-blue-600">Care</span></h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
          <NavItem id="overview" icon={HiOutlineMenu} label="Overview" />
          <NavItem id="health" icon={AiOutlineHeart} label="Health Records" />
          <NavItem id="reminders" icon={MdNotificationsActive} label="Medication" />
          <NavItem id="caregivers" icon={FaUsers} label="Caregivers" />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <HiOutlineUserCircle className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">{userEmail}</p>
                <p className="text-xs text-gray-500">Guardian</p>
              </div>
            </div>
            <button onClick={() => setShowProfile(true)} className="w-full text-xs font-medium text-blue-600 hover:underline text-left">
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
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'reminders' ? 'Medication' : activeTab}
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Welcome back, {userEmail.split('@')[0]}! 👋</h1>
                      <p className="text-blue-100 text-lg">Here's your health dashboard overview</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="text-sm text-blue-100 mb-1">Your Health Score</p>
                        <p className="text-4xl font-bold">
                          {healthRecords.length > 0 ? '85%' : '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={AiOutlineHeart} label="Health Records" value={healthRecords.length} color="blue" onClick={() => navigate("/healthRecord")} />
                  <StatCard icon={MdNotificationsActive} label="Active Reminders" value={reminders.length} color="green" onClick={() => navigate("/medicationmanage")} />
                  <StatCard icon={FaUsers} label="Caregivers Available" value={elders.length} color="purple" onClick={() => navigate("/carerequest")} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 text-xl mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('health')}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <AiOutlineHeart className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Add Vitals</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('reminders')}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <MdNotificationsActive className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Add Medicine</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('caregivers')}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <FaUsers className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Find Caregiver</span>
                    </button>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <HiOutlineUserCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">View Profile</span>
                    </button>
                  </div>
                </div>

                {/* Two Column Layout for Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Health Records */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 text-lg">Recent Health Data</h3>
                      <button
                        onClick={() => setActiveTab('health')}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {healthRecords.length > 0 ? (
                      <div className="space-y-3">
                        {healthRecords.slice(-3).reverse().map((record, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <AiOutlineHeart className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">BP: {record.bloodPressure} | Sugar: {record.sugarLevel}</p>
                                <p className="text-xs text-gray-500">Pulse: {record.pulseRate} | Temp: {record.temperature}°F</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <AiOutlineHeart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No health records yet</p>
                        <button
                          onClick={() => setActiveTab('health')}
                          className="mt-3 text-sm text-blue-600 hover:underline"
                        >
                          Add your first record
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Medication */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 text-lg">Today's Medications</h3>
                      <button
                        onClick={() => setActiveTab('reminders')}
                        className="text-sm text-green-600 hover:underline font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {reminders.length > 0 ? (
                      <div className="space-y-3">
                        {reminders.slice(0, 4).map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                <MdNotificationsActive className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{med.medicineName}</p>
                                <p className="text-xs text-gray-500">{med.dosage}</p>
                              </div>
                            </div>
                            <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                              {med.time || 'Daily'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <MdNotificationsActive className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No medication reminders</p>
                        <button
                          onClick={() => setActiveTab('reminders')}
                          className="mt-3 text-sm text-green-600 hover:underline"
                        >
                          Add your first reminder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Health Records Section */}
            {activeTab === "health" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left: Form */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                    <h3 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <AiOutlineHeart className="w-5 h-5" />
                      </div>
                      Add Vitals
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Blood Pressure</label>
                        <input
                          type="number"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                          placeholder="e.g. 120"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Sugar Level</label>
                        <input
                          type="number"
                          value={sugarLevel}
                          onChange={(e) => setSugarLevel(e.target.value)}
                          placeholder="e.g. 95"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Pulse Rate</label>
                        <input
                          type="number"
                          value={pulseRate}
                          onChange={(e) => setPulseRate(e.target.value)}
                          placeholder="e.g. 72"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Temperature</label>
                        <input
                          type="number"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value)}
                          placeholder="e.g. 98.6"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                        />
                      </div>
                      <button
                        onClick={handleAddHealthRecord}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all mt-4"
                      >
                        Save Record
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Chart */}
                <div className="lg:col-span-2 space-y-6">
                  {healthRecords.length > 0 ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[450px]">
                      <h3 className="font-bold text-gray-800 text-lg mb-6">Vital Trends Over Time</h3>
                      <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={healthRecords.map((record, index) => ({
                          ...record,
                          displayDate: record.createdAt
                            ? new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : `Record ${index + 1}`
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} tickMargin={10} stroke="#9CA3AF" />
                          <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="bloodPressure" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Blood Pressure" />
                          <Line type="monotone" dataKey="sugarLevel" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Sugar Level" />
                          <Line type="monotone" dataKey="pulseRate" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} name="Pulse Rate" />
                          <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} name="Temperature" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[450px] flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <AiOutlineHeart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No health records yet</p>
                        <p className="text-sm mt-2">Add your first vital readings to see trends</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Medication Section */}
            {activeTab === "reminders" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left: Form */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                    <h3 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <MdNotificationsActive className="w-5 h-5" />
                      </div>
                      Add Medicine
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Medicine Name</label>
                        <input
                          type="text"
                          value={medicineName}
                          onChange={(e) => setMedicineName(e.target.value)}
                          placeholder="e.g. Aspirin"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Dosage</label>
                        <input
                          type="text"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          placeholder="e.g. 500mg"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                        />
                      </div>
                      <button
                        onClick={handleAddReminder}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all mt-4"
                      >
                        Add Reminder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Active Meds List */}
                <div className="lg:col-span-2">
                  <h3 className="font-bold text-gray-800 text-xl mb-6">Active Medications</h3>
                  {reminders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reminders.map((med, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <MdNotificationsActive className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{med.medicineName}</h4>
                                <p className="text-sm text-gray-500">{med.dosage}</p>
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-xs">
                              {med.time || "Daily"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                      <MdNotificationsActive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-400 text-lg font-medium">No active medications</p>
                      <p className="text-sm text-gray-400 mt-2">Add your first medicine reminder to get started</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Caregivers Section */}
            {activeTab === "caregivers" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Find a Caregiver</h2>
                    <p className="text-gray-500 mt-1">Connect with professional caregivers</p>
                  </div>
                </div>

                {elders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {elders.map((caregiver, idx) => (
                      <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-24 h-24 rounded-full bg-purple-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                            {caregiver.profilePicture ? (
                              <img src={caregiver.profilePicture} alt={caregiver.fullname} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-purple-500 text-2xl font-bold">
                                {caregiver.fullname?.charAt(0) || "C"}
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">{caregiver.fullname}</h3>
                          <p className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full mt-1 mb-4">
                            Professional Caregiver
                          </p>

                          <div className="w-full border-t border-gray-100 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Email</span>
                              <span className="font-medium text-gray-700 truncate max-w-[150px]">{caregiver.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Phone</span>
                              <span className="font-medium text-gray-700">{caregiver.contactNumber || "N/A"}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddRequest(caregiver.elderId)}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <FaUsers className="w-4 h-4" />
                            Connect Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <FaUsers className="w-20 h-20 mx-auto mb-4 text-gray-300 opacity-50" />
                    <p className="text-gray-400 text-lg font-medium">No caregivers available</p>
                    <p className="text-sm text-gray-400 mt-2">Please check back later</p>
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
                <ElderProfileForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <ChatWidget />
      </div>
    </div>
  );
}
