import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";

export default function ElderProfileForm({ regId }) {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized: Missing token");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/guardian`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update + image upload
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Missing token");
        return;
      }

      let updatedProfile = { ...formData };

      // Upload image using your utility
      if (newProfileImage) {
        try {
          const uploadedUrl = await mediaUpload(newProfileImage);
          updatedProfile.profilePicture = uploadedUrl;
        } catch (error) {
          toast.error("Failed to upload profile image");
          console.error(error);
          return;
        }
      }

      const idToUpdate = profile.regId || regId;

      // Update backend
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/profile/${idToUpdate}`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setEditMode(false);
      setNewProfileImage(null);

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };

  if (!profile)
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-4xl mx-auto mt-6">
      <div className="flex items-center space-x-6">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-purple-400"
          />
        ) : (
          <FaUserCircle className="w-28 h-28 text-red-400 cursor-pointer" />
        )}

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{profile.fullName}</h2>
          <p className="text-gray-500">Age: {profile.age}</p>
          <p className="text-gray-500">Gender: {profile.gender}</p>
          <p className="text-gray-500">Email: {profile.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-gray-700"><span className="font-semibold">Phone:</span> {profile.phone}</p>
        <p className="text-gray-700"><span className="font-semibold">Address:</span> {profile.address}</p>
        <p className="text-gray-700"><span className="font-semibold">Guardian Name:</span> {profile.guardianFullName}</p>
        <p className="text-gray-700"><span className="font-semibold">Guardian Relationship:</span> {profile.guardianRelationship}</p>
        <p className="text-gray-700"><span className="font-semibold">Guardian Phone:</span> {profile.guardianPhone}</p>
        <p className="text-gray-700"><span className="font-semibold">Guardian Email:</span> {profile.guardianEmail}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setEditMode(true)}
          className="flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
        >
          <FaEdit className="mr-2 " /> Update Profile
        </button>
      </div>

      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              Edit Profile
              <button onClick={() => setEditMode(false)}>
                <FaTimes className="text-red-600 cursor-pointer" />
              </button>
            </h2>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProfileImage(e.target.files[0])}
                className="w-full p-2 border rounded-lg"
              />

              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  type={key.toLowerCase().includes("email") ? "email" : "text"}
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  placeholder={key}
                  className="w-full p-2 border rounded-lg"
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleUpdate}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer"
              >
                <FaSave className="mr-2" /> Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
