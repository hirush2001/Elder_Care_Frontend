import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function MyCareRequests() {
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0 });

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/caretaker/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        // ✅ Count statuses (your API uses "Pending" and maybe "C" for completed/accepted)
        const pendingCount = data.filter(
          (r) => r.status?.toLowerCase() === "pending"
        ).length;
        const acceptedCount = data.filter(
          (r) =>
            r.status?.toLowerCase() === "accepted" ||
            r.status?.toLowerCase() === "c"
        ).length;
        const rejectedCount = data.filter(
          (r) => r.status?.toLowerCase() === "rejected"
        ).length;

        setStats({
          pending: pendingCount,
          accepted: acceptedCount,
          rejected: rejectedCount,
        });

        setRequests(data);
      })
      .catch((err) => {
        console.error("Error fetching care requests:", err);
        toast.error("Failed to load your requests");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading requests...</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        My Care Requests
      </h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-yellow-100 text-yellow-800 shadow-md rounded-2xl p-6 text-center">
          <FaClock className="text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Pending Requests</h3>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>

        <div className="bg-green-100 text-green-800 shadow-md rounded-2xl p-6 text-center">
          <FaCheckCircle className="text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Accepted Requests</h3>
          <p className="text-3xl font-bold mt-2">{stats.accepted}</p>
        </div>

        <div className="bg-red-100 text-red-800 shadow-md rounded-2xl p-6 text-center">
          <FaTimesCircle className="text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Rejected Requests</h3>
          <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
        </div>
      </div>

      {/* ✅ Requests Table */}
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't made any care requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 border">Request ID</th>
                <th className="py-3 px-6 border">Request Date</th>
                <th className="py-3 px-6 border">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {requests.map((req) => (
                <tr
                  key={req.requestId}
                  className="text-center even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="py-2 px-4 border font-semibold">{req.requestId}</td>
                  <td className="py-2 px-4 border">{req.requestDate || "—"}</td>
                  <td
                    className={`py-2 px-4 border font-semibold ${
                      req.status?.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : req.status?.toLowerCase() === "rejected"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {req.status === "Accepted"
                      ? "Accepted"
                      : req.status || "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
