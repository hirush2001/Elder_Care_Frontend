import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import ChatWidget from "../../components/chatwidget";
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

  const [activeTab, setActiveTab] = useState("health");
  const [reminders, setReminders] = useState([]);

  // Health Record inputs
  const [bloodPressure, setBloodPressure] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  const [temperature, setTemperature] = useState("");

  // Reminder inputs
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  // Totals
  const [healthRecords, setHealthRecords] = useState([]);

  // Caregiver requests
  const [caregivers, setCaregivers] = useState([]); // fetched caregivers
  const [selectedCaregiver, setSelectedCaregiver] = useState(""); // chosen caregiver

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

    // Fetch caregivers
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/caretaker/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCaregivers(res.data.caregivers || []))
      .catch((err) => console.error("Error fetching caregivers:", err));
    
    //Fetch caregivers
    // Fetch caregivers from backend
axios
.get(`${import.meta.env.VITE_BACKEND_URL}/caretaker/all`, {
  headers: { Authorization: `Bearer ${token}` },
})
.then((res) => {
  if (Array.isArray(res.data)) {
    setCaregivers(res.data);
  } else {
    console.warn("No caregivers found or unexpected response:", res.data);
    setCaregivers([]);
  }
})
.catch((err) => {
  console.error("Error fetching caregivers:", err);
  toast.error("Failed to load caregivers");
});

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
        {}, // no body needed unless backend expects something
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
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-8">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700">Guardian Dashboard</h1>
          <p className="text-gray-500">{userEmail}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-3xl shadow-md transition cursor-pointer"
          >
            <FaUserCircle className="w-7 h-7" />
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-3xl shadow-md transition cursor-pointer"
          >
            <FiLogOut className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate("/healthRecord")}
          className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
        >
          <AiOutlineHeart className="text-blue-700 w-10 h-10" />
          <h2 className="text-lg font-semibold text-blue-700">Health Records</h2>
          <p className="text-3xl font-bold mt-2">{healthRecords.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Entries</p>
        </div>

        <div
          onClick={() => navigate("/medicationmanage")}
          className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
        >
          <MdNotificationsActive className="text-green-700 w-10 h-10" />
          <h2 className="text-lg font-semibold text-green-700">Reminders</h2>
          <p className="text-3xl font-bold mt-2">{reminders.length}</p>
          <p className="text-gray-500 text-sm mt-1">Active</p>
        </div>

        <div
          onClick={() => navigate("/carerequest")}
          className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
        >
          <FaUsers className="text-purple-700 w-10 h-10" />
          <h2 className="text-lg font-semibold text-purple-700">Caregiver Requests</h2>
          <p className="text-3xl font-bold mt-2">{caregivers.length}</p>
          <p className="text-gray-500 text-sm mt-1">Available</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b pb-2">
        <button
          className={`px-5 py-2 font-semibold rounded-t-2xl transition cursor-pointer ${
            activeTab === "health"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-blue-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("health")}
        >
          Health Records
        </button>

        <button
          className={`px-5 py-2 font-semibold rounded-t-2xl transition cursor-pointer ${
            activeTab === "reminders"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-green-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("reminders")}
        >
          Reminders
        </button>

        <button
          className={`px-5 py-2 font-semibold rounded-t-2xl transition cursor-pointer ${
            activeTab === "requests"
              ? "bg-purple-700 text-white"
              : "bg-gray-200 hover:bg-purple-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Care Request
        </button>
      </div>

      {/* Health Records Form */}
      {activeTab === "health" && (
        <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-3xl space-y-4">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Add Health Record</h2>
          <input
            type="number"
            placeholder="Blood Pressure"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className="w-full h-[50px] border border-blue-300 rounded-3xl shadow-md px-5 placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
          />
          <input
            type="number"
            placeholder="Sugar Level"
            value={sugarLevel}
            onChange={(e) => setSugarLevel(e.target.value)}
            className="w-full h-[50px] border border-blue-300 rounded-3xl shadow-md px-5 placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
          />
          <input
            type="number"
            placeholder="Pulse Rate"
            value={pulseRate}
            onChange={(e) => setPulseRate(e.target.value)}
            className="w-full h-[50px] border border-blue-300 rounded-3xl shadow-md px-5 placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
          />
          <input
            type="number"
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full h-[50px] border border-blue-300 rounded-3xl shadow-md px-5 placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
          />
          <button
            onClick={handleAddHealthRecord}
            className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-3xl shadow-lg transition cursor-pointer"
          >
            Add Record
          </button>
        </div>
      )}

      {/* Health Chart */}
      {activeTab === "health" && healthRecords.length > 0 && (
        <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-5xl mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-6 text-center">
            Health Record Trends
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={healthRecords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="healthId"
                label={{ value: "Record ID", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bloodPressure"
                stroke="#2563eb"
                name="Blood Pressure"
              />
              <Line
                type="monotone"
                dataKey="sugarLevel"
                stroke="#16a34a"
                name="Sugar Level"
              />
              <Line
                type="monotone"
                dataKey="pulseRate"
                stroke="#f97316"
                name="Pulse Rate"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                name="Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Reminders Form */}
      {activeTab === "reminders" && (
        <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-3xl space-y-4">
          <h2 className="text-xl font-bold text-green-700 mb-4">Add Medicine Reminder</h2>
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="w-full h-[50px] border border-green-300 rounded-3xl shadow-md px-5 placeholder-green-400 focus:ring-4 focus:ring-green-200 outline-none transition"
          />
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full h-[50px] border border-green-300 rounded-3xl shadow-md px-5 placeholder-green-400 focus:ring-4 focus:ring-green-200 outline-none transition"
          />
          <input
            type="time"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-[50px] border border-green-300 rounded-3xl shadow-md px-5 placeholder-green-400 focus:ring-4 focus:ring-green-200 outline-none transition"
          />
          <button
            onClick={handleAddReminder}
            className="w-full h-[50px] bg-green-600 hover:bg-green-700 text-white font-bold rounded-3xl shadow-lg transition cursor-pointer"
          >
            Add Reminder
          </button>
        </div>
      )}

      {/* Caregiver Request */}
      {activeTab === "requests" && (
  <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
      Request a Caregiver
    </h2>

    {caregivers.length > 0 ? (
      <div className="space-y-4">
        {caregivers.map((cg, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-purple-50 border border-purple-200 rounded-2xl p-4 hover:bg-purple-100 transition"
          >
            <div>
            <p className="text-gray-700">
                {cg.fullname}
              </p>
              <p className="text-gray-700">{cg.email}</p>
              <p className="text-gray-600">{cg.contactNumber}</p>
            </div>

            <button
              onClick={() => handleAddRequest(cg.careId)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-2xl shadow-md transition cursor-pointer"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500 mt-4">
        No caregivers available right now.
      </p>
    )}
  </div>
)}


      <ChatWidget />

    </div>
  );
}
