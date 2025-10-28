import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Email:", Email);
    console.log("Password:", Password);
    console.log("Role:", Role);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL+"/api/auth/login",
        {
          email:Email,
          password:Password,
          role:Role,
        }
      );

      toast.success("Login Successful 🎉");

      // Save token
      localStorage.setItem("token", response.data.token);

      // Navigate based on role (example)
      if (Role === "Admin") {
        navigate("/admin-dashboard");
      } else if (Role === "Caregiver") {
        navigate("/caregiver-dashboard");
      } else if (Role === "Elder") {
        navigate("/elder-dashboard");
      } else {
        navigate("/");
      }

      console.log(response.data);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 p-4">
  <form
    onSubmit={handleLogin}
    className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105"
  >
    <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">
      Smart ElderCare System
    </h2>
    <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

    <div className="mb-4 relative">
      <input
        type="email"
        placeholder="Email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        required
      />
    </div>

    <div className="mb-4 relative">
      <input
        type="password"
        placeholder="Password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        required
      />
    </div>

    <div className="mb-6">
      <select
        value={Role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        required
      >
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="Caregiver">Caregiver</option>
        <option value="Elder">Elder</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
    >
      Login
    </button>

    <ToastContainer position="top-right" autoClose={2000} />
  </form>
</div>

  );
}
