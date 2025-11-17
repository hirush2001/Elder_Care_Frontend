import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa"; // Trash icon

export default function HealthRecordManage() {
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all health records for logged-in elder
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/health/records`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecords(res.data.records || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching health records:", err);
        toast.error("Failed to load health records");
        setLoading(false);
      });
  }, [token]);

  // Delete a record
  const handleDelete = (healthId) => {
    if (!token) return toast.error("Not authenticated");
  
    // Custom confirm toast
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this record?</p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
              onClick={() => {
                toast.dismiss(t.id);
                // Call your delete API
                axios
                  .delete(`${import.meta.env.VITE_BACKEND_URL}/health/record/${healthId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then((res) => {
                    toast.success(res.data.message || "Record deleted successfully");
                    setRecords((prev) => prev.filter((r) => r.healthId !== healthId));
                  })
                  .catch((err) => {
                    console.error("Error deleting record:", err);
                    toast.error(err.response?.data?.message || "Failed to delete record");
                  });
              }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 } // 10 seconds
    );
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading health records...</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">My Health Records</h2>
      {records.length === 0 ? (
        <p className="text-center text-gray-500">No health records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 border">Health ID</th>
                <th className="py-3 px-6 border">Blood Pressure</th>
                <th className="py-3 px-6 border">Sugar Level</th>
                <th className="py-3 px-6 border">Pulse Rate</th>
                <th className="py-3 px-6 border">Temperature</th>
                <th className="py-3 px-6 border ">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {records.map((record) => (
                <tr
                  key={record.healthId}
                  className="text-center even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="py-2 px-4 border font-semibold">{record.healthId}</td>
                  <td className="py-2 px-4 border">{record.bloodPressure} mmHg</td>
                  <td className="py-2 px-4 border">{record.sugarLevel} mg/dL</td>
                  <td className="py-2 px-4 border">{record.pulseRate} bpm</td>
                  <td className="py-2 px-4 border">{record.temperature} °C</td>
                  <td className="py-2 px-4 border">
                 <div className="flex justify-center">
                      <button
                           onClick={() => handleDelete(record.healthId)}
                           className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                  >
                   <FaTrash /> Delete
                        </button>
  </div>
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
