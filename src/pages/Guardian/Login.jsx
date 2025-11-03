import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Elder"); // Default role can be Elder or Guardian

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password, role }
      );

      // Extract token and user info
      const { token, user } = response.data;

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("elderId", user.elderId);

      toast.success("Login successful!");

      // Navigate to dashboard (change according to role)
      navigate("/guardiandashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error || "Login failed. Check credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-blue-400"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-3 rounded-lg focus:outline-blue-400"
        >
          <option value="Elder">Elder</option>
          <option value="Guardian">Guardian</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
