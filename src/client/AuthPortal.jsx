import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const toggleMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      toast.success("Login Successful 🎉");
    } else {
      toast.success("Signup Successful 🎉");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-700 p-6">
      <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        
        {/* Left Section (Brand / Description) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white p-10">
          <h2 className="text-4xl font-extrabold mb-3">Smart ElderCare</h2>
          <p className="text-lg opacity-90 text-center">
            Simplify caregiving — connect elders and caregivers with ease.
          </p>
          <div className="mt-8">
            <button
              onClick={toggleMode}
              className="px-6 py-3 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              {isLogin ? "Create an Account" : "Already have an account?"}
            </button>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                  Welcome Back 👋
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Elder">Elder</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Login
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                  Create Account 🌟
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Elder">Elder</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
