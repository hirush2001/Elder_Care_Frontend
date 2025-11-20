import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineCheck, AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import ChatWidget from "../../components/chatwidget";

const mockRequests = [
  { id: 1, elderName: "Margaret Smith", caregiver: "John Smith", type: "Daily Care", time: "2 hours ago", status: "Pending" },
  { id: 2, elderName: "Robert Johnson", caregiver: "Sarah Johnson", type: "Medical Checkup", time: "5 hours ago", status: "Pending" },
  { id: 3, elderName: "Elizabeth Brown", caregiver: "Mike Brown", type: "Companionship", time: "1 day ago", status: "Pending" },
];

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guardian";

  const [requests, setRequests] = useState(mockRequests);
  const [showProfile, setShowProfile] = useState(false);

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [elderName, setElderName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !contactNumber || !elderName) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Details submitted successfully");
    setFormSubmitted(true);
  };

  const handleAcceptRequest = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Accepted" } : r));
    toast.success("Request accepted");
  };

  const handleRejectRequest = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    toast.error("Request rejected");
  };

  // Counts for cards
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const acceptedCount = requests.filter(r => r.status === "Accepted").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  // Filter requests based on active tab
  const filteredRequests = requests.filter(r => r.status === activeTab);

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
            onClick={() => setShowProfile(true)}
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

      {!formSubmitted ? (
        <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-md mx-auto">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Enter Your Details</h2>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-[50px] border border-blue-300 rounded-3xl px-5 shadow-md placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full h-[50px] border border-blue-300 rounded-3xl px-5 shadow-md placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
            />
            <input
              type="text"
              placeholder="Elder Name"
              value={elderName}
              onChange={(e) => setElderName(e.target.value)}
              className="w-full h-[50px] border border-blue-300 rounded-3xl px-5 shadow-md placeholder-blue-400 focus:ring-4 focus:ring-blue-200 outline-none transition"
            />
            <button
              type="submit"
              className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-3xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2"
            >
              <AiOutlineCheck className="w-5 h-5" /> Submit
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="flex flex-wrap gap-6 justify-center mb-6">
            <div
              className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
            >
              <AiOutlineCheck className="text-yellow-500 w-10 h-10" />
              <h2 className="text-lg font-semibold text-yellow-500">Pending</h2>
              <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              <p className="text-gray-500 text-sm mt-1">Requests</p>
            </div>

            <div
              className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
            >
              <AiOutlineCheck className="text-green-700 w-10 h-10" />
              <h2 className="text-lg font-semibold text-green-700">Accepted</h2>
              <p className="text-3xl font-bold mt-2">{acceptedCount}</p>
              <p className="text-gray-500 text-sm mt-1">Requests</p>
            </div>

            <div
              className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center gap-2 cursor-pointer"
            >
              <AiOutlineClose className="text-red-500 w-10 h-10" />
              <h2 className="text-lg font-semibold text-red-500">Rejected</h2>
              <p className="text-3xl font-bold mt-2">{rejectedCount}</p>
              <p className="text-gray-500 text-sm mt-1">Requests</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 border-b pb-2">
            {["Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 font-semibold rounded-t-2xl transition cursor-pointer ${
                  activeTab === tab
                    ? tab === "Pending"
                      ? "bg-yellow-500 text-white"
                      : tab === "Accepted"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Requests Table */}
          <div className="bg-white shadow-lg rounded-3xl p-6 w-[90%] max-w-4xl mx-auto space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold">{req.elderName}</p>
                    <p className="text-gray-600">{req.caregiver}</p>
                    <p className="text-gray-500">{req.type} • {req.time}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl shadow-md transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl shadow-md transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status !== "Pending" && (
                      <span className={`px-3 py-1 rounded-2xl text-white ${
                        req.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No {activeTab.toLowerCase()} requests.</p>
            )}
          </div>
        </>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-4xl relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <p className="text-center text-gray-700 font-semibold">Profile Component Goes Here</p>
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}
