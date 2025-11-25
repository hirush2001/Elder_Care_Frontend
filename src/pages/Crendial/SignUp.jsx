import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Elder"); // default
  const [coNumber, setCoNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Validators
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?\d{7,15}$/;

  const validate = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !role.trim() || !coNumber.trim()) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!emailRe.test(email.trim())) {
      toast.error("Enter a valid email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!phoneRe.test(coNumber.trim())) {
      toast.error("Enter a valid phone number (digits, optional +)");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        co_number: coNumber.trim(),
      };

      const url = `${import.meta.env.VITE_BACKEND_URL || ""}/api/auth/register`;

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      if (res.status === 200 || res.status === 201 || /create|success/i.test(res.data?.message || "")) {
        toast.success("Account created — Redirecting to login...");
        setTimeout(() => navigate("/login"), 900);
      } else {
        toast.success(res.data?.message || "Registered successfully");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null);

      if (err?.response?.status === 409) toast.error(serverMsg || "Email already registered");
      else if (err?.response?.status === 400 || err?.response?.status === 422) toast.error(serverMsg || "Invalid data");
      else if (err?.code === "ECONNABORTED") toast.error("Request timed out. Try again.");
      else toast.error(serverMsg || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-[80%] max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-10">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <p className="text-lg text-gray-600 mt-2">Join Elder Care System and get started.</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-6">

            <input
              type="text"
              placeholder="Full name (e.g., John Doe)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border p-4 text-lg rounded-xl focus:outline-blue-500"
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email (e.g., john@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-4 text-lg rounded-xl focus:outline-blue-500"
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-4 text-lg rounded-xl focus:outline-blue-500"
              disabled={loading}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-4 text-lg rounded-xl focus:outline-blue-500"
              disabled={loading}
            >
              <option value="Elder">Elder</option>
              <option value="Guardian">Guardian</option>
              <option value="Caregiver">Caregiver</option>
            </select>

            <input
              type="tel"
              placeholder="Contact number (e.g., +9477xxxxxxx)"
              value={coNumber}
              onChange={(e) => setCoNumber(e.target.value)}
              className="border p-4 text-lg rounded-xl focus:outline-blue-500"
              disabled={loading}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-4 rounded-xl text-xl hover:bg-blue-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <div className="text-center text-lg">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 underline"
                disabled={loading}
              >
                Log in
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
