import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Icons
import {
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
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
      desc: "Access your care details",
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/30",
      text: "text-blue-600",
      Icon: UserIcon,
    },
    {
      id: "Caregiver",
      title: "Caregiver",
      desc: "Manage tasks & routines",
      color: "from-teal-500 to-emerald-400",
      shadow: "shadow-teal-500/30",
      text: "text-teal-600",
      Icon: UserGroupIcon,
    },
    {
      id: "Admin",
      title: "Admin",
      desc: "System controls",
      color: "from-amber-500 to-orange-400",
      shadow: "shadow-amber-500/30",
      text: "text-amber-600",
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

      toast.success("Welcome back!");

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] rounded-full bg-teal-500/20 blur-[80px] animate-bounce duration-[10000ms]"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[650px] m-4 border border-white/40"
      >

        {/* Left: Branding & Welcome (Animated) */}
        <div className="hidden lg:flex flex-col relative justify-between p-12 bg-gradient-to-br from-indigo-600 to-violet-700 text-white overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">EC</span>
              </div>
              <span className="text-xl font-medium tracking-wide opacity-90">Elder Care System</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Welcome <br /> <span className="text-indigo-200">Back Home.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-indigo-100 max-w-sm leading-relaxed opacity-80">
              Your health, comfort, and peace of mind are our top priorities. Sign in to access your personalized dashboard.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="relative z-10 text-sm font-medium opacity-60">
            © {new Date().getFullYear()} Smart Elder Care.
          </motion.div>
        </div>

        {/* Right: Form */}
        <div className="p-8 lg:p-14 flex flex-col justify-center bg-white/50">
          <motion.div variants={itemVariants} className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Sign In</h2>
            <p className="text-slate-500 font-medium">Select your role to continue</p>
          </motion.div>

          {/* Role Selector */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="grid grid-cols-3 gap-4">
              {roles.map((r) => {
                const ActiveIcon = r.Icon;
                const isActive = role === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onChooseRole(r.id)}
                    className={`relative overflow-hidden group flex flex-col items-center justify-center gap-3 py-5 px-2 rounded-2xl transition-all duration-300 cursor-pointer border-2
                      ${isActive
                        ? `border-transparent bg-white shadow-lg scale-[1.05]`
                        : "bg-white/50 border-transparent hover:bg-white hover:shadow-md hover:-translate-y-1"
                      }
                    `}
                  >
                    {/* Active Gradient Border/Background */}
                    {isActive && (
                      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${r.color}`}></div>
                    )}
                    {isActive && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${r.color}`}></div>
                    )}

                    <ActiveIcon
                      className={`w-9 h-9 transition-colors duration-300 ${isActive ? r.text : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    />
                    <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? "text-slate-800" : "text-slate-500"}`}>
                      {r.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-6">

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <input
                ref={emailRef}
                type="email"
                className={`w-full rounded-2xl border-2 px-5 py-4 text-lg outline-none transition-all duration-300
                    ${errors.email
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]"
                  }`}
                placeholder="Ex: john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm font-semibold text-red-500 mt-2 ml-1 animate-pulse">
                  {errors.email}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  FORGOT PASSWORD?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-lg outline-none transition-all duration-300 pr-14
                    ${errors.password
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]"
                    }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm font-semibold text-red-500 mt-2 ml-1 animate-pulse">
                  {errors.password}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Signing in..." : "Sign In"}
                </span>
              </button>
            </motion.div>
          </form>

          {/* Create Account */}
          <motion.div variants={itemVariants} className="mt-8 text-center bg-white/60 rounded-xl py-4 border border-white/50">
            <p className="text-slate-600 font-medium">
              New to our community?{" "}
              <Link
                to="/signup"
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-indigo-500 hover:from-purple-500 transition-all"
              >
                Create an Account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
