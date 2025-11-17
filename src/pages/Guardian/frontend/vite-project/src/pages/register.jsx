// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

  const validate = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.error("Fill all fields");
      return false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      toast.error("Invalid email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting register:", { firstName, lastName, email }); // debug

    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        firstName: firstName.trim(),
        role:role,
        email: email.trim().toLowerCase(),
        password,
      };

      const res = await axios.post(`${base}/users/register`, payload);
      console.log("Register response:", res.status, res.data);

      if (res.status === 201 || (res.data?.message && /create|success/i.test(res.data.message))) {
        toast.success("Registered successfully — Redirecting to login...");
        setTimeout(() => navigate("/login"), 700);
      } else {
        toast.error(res.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[url('/final.webp')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full" />

      <div className="w-[50%] h-full flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-[500px] h-[520px] backdrop-blur-md rounded-[20px] shadow-2xl my-[20px] flex flex-col justify-center items-center p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Register</h2>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-[300px] h-[50px] border rounded-[20px] my-[8px] px-3"
          />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-[300px] h-[50px] border rounded-[20px] my-[8px] px-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-[300px] h-[50px] border rounded-[20px] my-[8px] px-3"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-[300px] h-[50px] border rounded-[20px] my-[8px] px-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-[300px] h-[50px] bg-[#4ea7a1] text-white rounded-[20px] font-bold my-[14px] disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-2 text-sm">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-blue-600 underline">
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
