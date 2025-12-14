import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

import ChatWidget from "../../components/chatwidget";
import CaregiverProfileForm from "./CareGiverProfile";

export default function CareGiverDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Caregiver";
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending");
  const [caregiverProfile, setCaregiverProfile] = useState(null);
   const [profileImage, setProfileImage] = useState(null);

  // ----------------------------
  // FETCH REQUESTS
  // ----------------------------
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

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ----------------------------
  // ACCEPT REQUEST
  // ----------------------------
  const handleAcceptRequest = async (requestId) => {
    if (!requestId) return toast.error("Invalid request ID");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/elder/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Request accepted");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
    }
  };

  // ----------------------------
  // REJECT REQUEST
  // ----------------------------
  const handleRejectRequest = async (requestId) => {
    if (!requestId) return toast.error("Invalid request ID");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/caretaker/elder/reject/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.error("Request rejected");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  // ----------------------------
  // FETCH PROFILE WHEN CLICK PROFILE ICON
  // ----------------------------
  const fetchCaregiverProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/guardian/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((res) => { 
        setProfileImage(res.data.profilePicture);
        setCaregiverProfile(res.data);
        setShowProfile(true);
      })

     
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

  // ----------------------------
  // FILTERING
  // ----------------------------
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const acceptedCount = requests.filter((r) => r.status === "Accepted").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const filteredRequests = requests.filter((r) => r.status === activeTab);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-8">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700">Caregiver Dashboard</h1>
          <p className="text-gray-500">{userEmail}</p>
        </div>

        <div className="flex gap-8">
          <button
            onClick={fetchCaregiverProfile}
            className="cursor-pointer"
          >
            {profileImage ? (
  <img
    src={profileImage}
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover border border-gray-300"
  />
) : (
  <HiOutlineUserCircle className="w-10 h-10" />
)}
          </button>

          <button
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <HiOutlineLogout className="w-10 h-10" />
          </button>
        </div>
      </header>

      {/* COUNTS */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <AiOutlineCheck className="text-yellow-500 w-10 h-10" />
          <h2 className="text-lg font-semibold text-yellow-500">Pending</h2>
          <p className="text-3xl font-bold mt-2">{pendingCount}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <AiOutlineCheck className="text-green-700 w-10 h-10" />
          <h2 className="text-lg font-semibold text-green-700">Accepted</h2>
          <p className="text-3xl font-bold mt-2">{acceptedCount}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-5 w-[280px] text-center flex flex-col items-center">
          <AiOutlineClose className="text-red-500 w-10 h-10" />
          <h2 className="text-lg font-semibold text-red-500">Rejected</h2>
          <p className="text-3xl font-bold mt-2">{rejectedCount}</p>
        </div>
      </div>

      {/* TABS */}
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

      {/* REQUEST LIST */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-[90%] max-w-4xl mx-auto space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.requestId}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-semibold">{req.elder?.fullName}</p>
                <p className="text-gray-600">{req.elder?.contactNumber}</p>
                <p className="text-gray-600">{req.elder?.email}</p>
                <p className="text-gray-500">{req.type} • {req.time}</p>
              </div>

              <div className="flex gap-2">
                {req.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleAcceptRequest(req.requestId)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl shadow-md transition cursor-pointer"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleRejectRequest(req.requestId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl shadow-md transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-2xl text-white ${
                      req.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No {activeTab.toLowerCase()} requests.
          </p>
        )}
      </div>

      {/* PROFILE MODAL */}
      {showProfile && caregiverProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-3xl relative">

            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

            <div className="grid grid-cols-2 gap-4">

              <p><strong>Full Name:</strong> {caregiverProfile.fullName}</p>
              <p><strong>Age:</strong> {caregiverProfile.age}</p>
              <p><strong>Gender:</strong> {caregiverProfile.gender}</p>
              <p><strong>Email:</strong> {caregiverProfile.email}</p>
              <p><strong>Phone:</strong> {caregiverProfile.phone}</p>
              <p><strong>Address:</strong> {caregiverProfile.address}</p>

            </div>

            <button
              onClick={() => navigate("/cprofile")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl mt-5"
            >
              Edit Profile
            </button>

          </div>
        </div>
      )}

{showProfile && (
              <div className="fixed inset-0 bg-black bg-opacity flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-4xl relative">
                      <button
                          onClick={() => setShowProfile(false)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold cursor-pointer"
                      >
                          ✕
            </button>
            <CaregiverProfileForm />
                  </div>
                  </div>
          )}

      <ChatWidget />
    </div>
  );
}
