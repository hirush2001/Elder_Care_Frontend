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

  // basic validators
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?\d{7,15}$/; // allow optional +, 7-15 digits

  const validate = () => {
    if (!fullName.trim() || !email.trim() || !password || !role.trim() || !coNumber.trim()) {
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

      // Adjust path if your backend uses a different route
      const url = `${import.meta.env.VITE_BACKEND_URL || ""}/api/auth/register`;

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      // If backend returns created/ok or message indicating success
      if (res.status === 201 || res.status === 200 || /create|success/i.test(res.data?.message || "")) {
        toast.success("Account created — Redirecting to login...");
        setTimeout(() => navigate("/login"), 800);
      } else {
        toast.success(res.data?.message || "Registered successfully");
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const serverMsg =
        err?.response?.data?.message || (typeof err?.response?.data === "string" ? err.response.data : null);

      if (err?.response?.status === 409) toast.error(serverMsg || "Email already registered");
      else if (err?.response?.status === 400 || err?.response?.status === 422) toast.error(serverMsg || "Invalid data");
      else if (err?.code === "ECONNABORTED") toast.error("Request timed out. Try again.");
      else toast.error(serverMsg || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-300">
        <form onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px] flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">
                    Sign up
        </h2>

    <input type="text"
    name="fullName"
    placeholder="Full name"
    value={fullName}
    onChange={(e)=> setFullName(e.target.valueAsDate)}
    required
    className="border p-3 rounded-b-lg focus:outline-blue-500"
    disabled={loading}
/>

  <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-blue-400"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-blue-400"
          disabled={loading}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-3 rounded-lg focus:outline-blue-400"
          disabled={loading}
        >
          <option value="Elder">Elder</option>
          <option value="Guardian">Guardian</option>
          <option value="Caregiver">Caregiver</option>
           
        </select>

        <input
          type="tel"
          placeholder="Contact number (e.g. +947XXXXXXXX)"
          value={coNumber}
          onChange={(e) => setCoNumber(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-blue-400"
          disabled={loading}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}/> 
        
          {loading ? "Creating account..." : "Create account"}

          <p className="text-center text-sm">
            Alredy Registered?{""}
            <button type="button" onClick={()=> navigate("/login")}
            className="text-blue-700 underline"
            disabled={loading}>  login

        </button>
        </p>
        </form>
    </div>
        
     
  );
}

