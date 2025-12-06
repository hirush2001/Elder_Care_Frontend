import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Icons
import {
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef();

  // --------------------------
  // ROLE OPTIONS
  // --------------------------
  const roles = [
    {
      id: "Elder",
      title: "Elder",
      desc: "Access your care details, health reports and appointments.",
      accent: "#0b6ff0",
      Icon: UserIcon,
    },
    {
      id: "Caregiver",
      title: "Caregiver",
      desc: "Manage elder care, daily routines and engagement tasks.",
      accent: "#0f6f5e",
      Icon: UserGroupIcon,
    },
    {
      id: "Admin",
      title: "Admin",
      desc: "Full access to system admin controls and dashboards.",
      accent: "#eab308",
      Icon: ShieldCheckIcon,
    },
  ];

  // --------------------------
  // STATES
  // --------------------------
  const [role, setRole] = useState("Elder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // Role select
  const onChooseRole = (selected) => {
    setRole(selected);
  };

  // --------------------------
  // LOGIN SUBMIT HANDLER
  // --------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setErrors({});

    if (!email) {
      setErrors((e) => ({ ...e, email: "Email is required" }));
      setLoading(false);
      return;
    }

    if (!password) {
      setErrors((e) => ({ ...e, password: "Password is required" }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password, role }
      );

      const { token, user } = response.data;

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("elderId", user.elderId);

      toast.success("Login successful!");

      const backendRole = user.role.toLowerCase();

      if (backendRole === "elder") navigate("/guardiandashboard");
      else if (backendRole === "caregiver") navigate("/caregiverdashboard");
      else if (backendRole === "admin") navigate("/admindashboard");
      else navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f3f8ff] p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left: Branding */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#0b6ff0] to-[#0f4fcf] text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              EC
            </div>
            <h2 className="text-2xl font-semibold">Elder Care</h2>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 p-8 md:p-12">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#063d66]">Sign in</h1>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <div className="flex gap-3">
              {roles.map((r) => {
                const ActiveIcon = r.Icon;
                const isActive = role === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onChooseRole(r.id)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border shadow-sm transition cursor-pointer
                      ${
                        isActive
                          ? "bg-[#eef6ff] border-[#0b6ff0] ring-1 ring-[#0b6ff0]/30"
                          : "bg-white border-gray-200"
                      }
                    `}
                    title={r.desc}
                  >
                    <ActiveIcon
                      className={`w-6 h-6 ${
                        isActive ? "text-[#0b6ff0]" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-gray-700">
                      {r.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} noValidate>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-bold text-gray-700">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-[#0b6ff0] ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm pr-12 focus:ring-2 focus:ring-[#0b6ff0] ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 font-bold text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-sm text-gray-500 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold"
                style={{
                  background: "linear-gradient(90deg,#0b6ff0,#0f4fcf)",
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading && (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      strokeDasharray="60"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                <span>{loading ? "Signing in..." : "Sign in"}</span>
              </button>
            </div>
          </form>

          {/* Create Account */}
          <div className="mt-6 text-center text-gray-500">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[15px] font-bold text-black hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
