import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function MedicationManage() {
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    medicineName: "",
    dosage: "",
    time: "",
  });

  // ✅ Fetch all medication schedules
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/medical/getmed`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecords(res.data.records || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medication schedules:", err);
        toast.error("Failed to load medications");
        setLoading(false);
      });
  }, [token]);

  // ✅ Delete medication
  const handleDelete = (medId) => {
    if (!token) return toast.error("Not authenticated");

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this medication?</p>
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
                axios
                  .delete(`${import.meta.env.VITE_BACKEND_URL}/medical/${medId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then(() => {
                    toast.success("Medication deleted successfully");
                    setRecords((prev) => prev.filter((r) => r.medId !== medId));
                  })
                  .catch((err) => {
                    console.error("Error deleting medication:", err);
                    toast.error("Failed to delete medication");
                  });
              }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  // ✅ Handle edit
  const handleEdit = (record) => {
    setEditingRecord(record.medId);
    setUpdatedData({
      medicineName: record.medicineName || "",
      dosage: record.dosage || "",
      time: record.time || "",
    });
  };

  // ✅ Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/medical/${editingRecord}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Medication updated successfully");
        setRecords((prev) =>
          prev.map((r) =>
            r.medId === editingRecord ? { ...r, ...updatedData } : r
          )
        );
        setEditingRecord(null);
      })
      .catch((err) => {
        console.error("Error updating medication:", err);
        toast.error("Failed to update medication");
      });
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading medications...</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        My Medication Schedule
      </h2>

      {records.length === 0 ? (
        <p className="text-center text-gray-500">No medications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 border">Medication ID</th>
                <th className="py-3 px-6 border">Medicine Name</th>
                <th className="py-3 px-6 border">Dosage</th>
                <th className="py-3 px-6 border">Time</th>
                <th className="py-3 px-6 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {records.map((record) => (
                <tr
                  key={record.medId}
                  className="text-center even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="py-2 px-4 border font-semibold">{record.medId}</td>
                  <td className="py-2 px-4 border">{record.medicineName}</td>
                  <td className="py-2 px-4 border">{record.dosage}</td>
                  <td className="py-2 px-4 border">{record.time}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(record)}
                        className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.medId)}
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

      {/* ✅ Update Form */}
      {editingRecord && (
        <form
          onSubmit={handleUpdate}
          className="mt-6 bg-blue-50 p-6 rounded-lg shadow-lg max-w-lg mx-auto"
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-700">
            Update Medication
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Medicine Name"
              value={updatedData.medicineName}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, medicineName: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Dosage"
              value={updatedData.dosage}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, dosage: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="time"
              value={updatedData.time}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, time: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
