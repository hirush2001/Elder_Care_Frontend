import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


// Professional, single-file Login component styled with TailwindCSS
// Save as: src/components/Login.jsx

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const roles = [
    { id: "Elder", title: "Elder", desc: "Access for elders / guardians" },
    { id: "Caregiver", title: "Caregiver", desc: "Access for caregivers" },
    { id: "Admin", title: "Admin", desc: "Administrator access" },
  ];

  const [step, setStep] = useState("choose"); // "choose" | "login"
  const [role, setRole] = useState(roles[0].id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (step === "login" && emailRef.current) emailRef.current.focus();
  }, [step]);

  // Basic client-side validation
  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChooseRole = (selected) => {
    setRole(selected);
    setStep("login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", user?.email || "");
        localStorage.setItem("userRole", user?.role || "");
        if (user?.elderId) localStorage.setItem("elderId", user.elderId);
      } else {
        // keep things tidy
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("elderId");
      }

      toast.success("Welcome back!");

      const backendRole = (user?.role || "").toLowerCase();
      if (backendRole === "elder") navigate("/guardiandashboard");
      else if (backendRole === "caregiver") navigate("/caregiverdashboard");
      else if (backendRole === "admin") navigate("/admindashboard");
      else navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f3f8ff] p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Illustration / Branding */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#0b6ff0] to-[#0f4fcf] text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">EC</div>
            <div>
              <h2 className="text-2xl font-semibold">Elder Care</h2>
               </div>
          </div>

           

           
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 p-8 md:p-12">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#063d66]">Sign in</h1>
                </div>
            
          </header>

          {/* Role selector */}
          <div className="mb-6">
             <div className="flex gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChooseRole(r.id)}
                  className={`flex-1 text-left font-bold px-4 py-3 rounded-xl border shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${
                    role === r.id ? "bg-[#eef6ff] border-[#bebeba]" : "bg-white border-gray-200"
                  }`}
                  aria-pressed={role === r.id}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">{r.title}</div>
                      
                    </div>
                    {role === r.id && (
                      <div className="text-sm font-medium text-[#0b6ff0]"> </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold   text-gray-700">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  className={`mt-2 w-full  rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-[#0b6ff0] ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm pr-28 focus:ring-2 focus:ring-[#0b6ff0] ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />

                  <button
  type="button"
  onClick={() => setShowPassword((s) => !s)}
  className="
    absolute 
    right-3 
    top-1/2 
    -translate-y-1/2 
    p-2 
    rounded-full 
    bg-white 
    shadow-sm 
    cursor-pointer
  "
  aria-label={showPassword ? 'Hide password' : 'Show password'}
>
  {showPassword ? (
    <EyeSlashIcon className="w-5 h-5 text-gray-600" />
  ) : (
    <EyeIcon className="w-5 h-5 text-gray-600" />
  )}
</button>
                </div>
                {errors.password && <p id="password-error" className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center font-bold gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>

                <button type="button" onClick={() => toast('Reset password flow placeholder')} className="text-sm text-gray-500 font-bold hover:underline">
                  Forgot password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'linear-gradient(90deg,#0b6ff0,#0f4fcf)', opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeDasharray="60" strokeLinecap="round" fill="none" />
                    </svg>
                  ) : null}
                  <span>{loading ? 'Signing  in...' : 'Sign in'}</span>
                </button>
              </div>
            </div>
          </form>

        <br/>

            <div className="text-center text-gray-500">
        <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[15px] font-bold text-black hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
            </div>
      </div>
    </div>
  );
}
