import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  UserCircleIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

export default function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Elder");
  const [coNumber, setCoNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?\d{7,15}$/;

  const roles = [
    {
      id: "Elder",
      title: "Elder",
      desc: "Access care details",
      color: "from-blue-500 to-cyan-400",
      text: "text-blue-600",
      Icon: UserIcon,
    },
    {
      id: "Caregiver",
      title: "Caregiver",
      desc: "Manage tasks",
      color: "from-teal-500 to-emerald-400",
      text: "text-teal-600",
      Icon: UserGroupIcon,
    }/*,
    {
      id: "Admin",
      title: "Admin",
      desc: "Admin controls",
      color: "from-amber-500 to-orange-400",
      text: "text-amber-600",
      Icon: ShieldCheckIcon,
    },*/
  ];

  const convertRole = (r) => {
    const map = {
      Elder: "elder",
      Admin: "admin",
      Caregiver: "caregiver",
    };
    return map[r] || "elder";
  };

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
      toast.error("Enter a valid phone number");
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
        role: convertRole(role),
        contactNumber: coNumber.trim(),
      };

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`;

      await axios.post(url, payload);

      toast.success("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);

    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err?.response?.data?.error || "Signup failed");
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
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] animate-bounce duration-[12000ms]"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px] m-4 border border-white/40"
      >

        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col relative justify-between p-12 bg-gradient-to-br from-teal-700 to-indigo-800 text-white overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 top-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">EC</span>
              </div>
              <span className="text-xl font-medium tracking-wide opacity-90">Elder Care System</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Join Our <br /> <span className="text-teal-200">Caring Family.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-teal-100 max-w-sm leading-relaxed opacity-80">
              Experience peace of mind with a smart system designed to keep you connected, healthy, and safe.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="relative z-10 text-sm font-medium opacity-60">
            © {new Date().getFullYear()} Smart Elder Care.
          </motion.div>
        </div>

        {/* Right Form */}
        <div className="p-8 lg:p-14 flex flex-col justify-center overflow-y-auto bg-white/50">
          <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Join us today! Select your role to get started.</p>
          </motion.div>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider ml-1">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => {
                  const ActiveIcon = r.Icon;
                  const isActive = role === r.id;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative overflow-hidden group flex flex-col items-center justify-center gap-2 py-4 px-1 rounded-2xl transition-all duration-300 cursor-pointer border-2
                              ${isActive
                          ? "border-transparent bg-white shadow-lg scale-[1.03]"
                          : "bg-white/40 border-transparent hover:bg-white hover:shadow-md"
                        }
                            `}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${r.color}`}></div>
                      )}
                      {isActive && (
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${r.color}`}></div>
                      )}

                      <ActiveIcon
                        className={`w-7 h-7 transition-colors duration-300 ${isActive ? r.text : "text-slate-400 group-hover:text-slate-600"
                          }`}
                      />
                      <span className={`text-xs font-bold transition-colors duration-300 ${isActive ? "text-slate-800" : "text-slate-500"}`}>
                        {r.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Full Name</label>
              <div className="relative">
                <UserCircleIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-base focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-base focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Contact Number</label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={coNumber}
                  onChange={(e) => setCoNumber(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-base focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
              <div className="relative">
                <ShieldCheckIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-12 py-3.5 text-base focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                className="w-full relative overflow-hidden rounded-2xl bg-teal-600 px-8 py-4 text-white font-bold text-lg shadow-xl shadow-teal-500/20 transition-all hover:bg-teal-700 hover:scale-[1.01] hover:shadow-teal-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Creating account..." : "Create Account"}
                </span>
              </button>
            </motion.div>

            {/* Login Redirect */}
            <motion.div variants={itemVariants} className="text-center bg-white/60 rounded-xl py-4 border border-white/50">
              <p className="text-slate-600 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 hover:to-teal-500 hover:from-indigo-500 transition-all"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>

          </form>
        </div>

      </motion.div>
    </div>
  );
}
