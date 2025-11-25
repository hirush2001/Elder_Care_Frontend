import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * ElderCare Login (Wide Right Panel)
 * - Layout: left 33% illustration, right 67% large role selection + form
 * - Larger touch targets, fonts and spacing for elder-friendly UX
 * - Preserves login logic: role selection -> form -> API -> localStorage -> navigate
 *
 * Illustration path (local): /mnt/data/A_UI_design_for_a_login_screen_targeting_elder_car.png
 */

export default function Login() {
  const navigate = useNavigate();

  // step: "choose" | "form"
  const [step, setStep] = useState("choose");
  const [role, setRole] = useState("Elder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // role → dashboard route (unchanged)
  const dashboardRouteFor = {
    Elder: "/elderdashboard",
    Guardian: "/guardiandashboard",
    Caregiver: "/caregiverdashboard",
  };

  const onChooseRole = (r) => {
    setRole(r);
    setStep("form");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || ""}/api/auth/login`,
        { email: email.trim(), password, role },
        { timeout: 15000 }
      );

      const { token, user } = response.data;

      if (token) localStorage.setItem("token", token);
      if (user?.email) localStorage.setItem("userEmail", user.email);
      if (user?.role) localStorage.setItem("userRole", user.role);
      if (user?.elderId) localStorage.setItem("elderId", user.elderId);

      toast.success("Login successful!");
      navigate(dashboardRouteFor[role] || "/");
    } catch (error) {
      console.error("Login error:", error);
      const serverMsg =
        error?.response?.data?.error || error?.response?.data?.message;
      toast.error(serverMsg || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "Elder",
      title: "Elder",
      desc: "Access personal care, appointments & notes",
      color: "bg-teal-500",
      accent: "#12b39a",
    },
    {
      id: "Guardian",
      title: "Guardian",
      desc: "Manage elders, approvals & bookings",
      color: "bg-blue-600",
      accent: "#0b6ff0",
    },
    {
      id: "Caregiver",
      title: "Caregiver",
      desc: "View tasks, schedules & care plans",
      color: "bg-orange-500",
      accent: "#ff7a6a",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f8ff] flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Left: Illustration (approx 33%) */}
        <aside className="hidden lg:flex lg:col-span-4 bg-white rounded-3xl shadow-lg items-center justify-center p-8 overflow-hidden">
          <div className="w-full">
            <img
              src="/mnt/data/A_UI_design_for_a_login_screen_targeting_elder_car.png"
              alt="Elder care illustration"
              className="w-full h-80 object-contain select-none"
              draggable={false}
            />
            <h2 className="mt-6 text-2xl font-bold text-[#0b4f8a]">ElderCare Portal</h2>
            <p className="mt-2 text-gray-600">
              Securely access appointments, care plans and reports — built for elders, guardians and caregivers.
            </p>
          </div>
        </aside>

        {/* Right: Wide panel (approx 67%) */}
        <main className="lg:col-span-8 bg-white rounded-3xl shadow-xl p-8 flex flex-col">
          {/* Header */}
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#07325a]">Welcome</h1>
              
            </div>
             
          </header>

          <div className="flex-1 flex flex-col lg:flex-row gap-8">
            {/* Left area inside right panel: Role selection (tall and wide) */}
            <section className="lg:w-1/2 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your role</h2>
                <p className="mt-1 text-gray-600">Choose how you'd like to sign in</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onChooseRole(r.id)}
                    className="flex items-center gap-4 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md focus:shadow-outline transition transform hover:-translate-y-0.5"
                    aria-label={`Continue as ${r.title}`}
                    style={{ minHeight: 96 }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                      style={{ background: r.accent }}
                    >
                      {r.title[0]}
                    </div>

                    <div className="text-left">
                      <div className="text-2xl font-semibold text-[#063d66]">{r.title}</div>
                      <div className="mt-1 text-lg text-gray-600 max-w-[520px]">{r.desc}</div>
                    </div>

                    {/* Selected indicator */}
                    <div className="ml-auto">
                      {role === r.id ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#e6f6f1] text-[#0f6f5e]">
                          Selected
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>

               
            </section>

            {/* Right area inside right panel: Form (wide, spacious) */}
            <section className="lg:w-1/2 bg-[#f8fbff] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#063d66]">
                      {step === "choose" ? "Quick sign in" : `Sign in as ${role}`}
                    </h3>
                    <p className="text-gray-600 mt-1">Enter credentials to continue</p>
                  </div>

                  <button
                    onClick={() => {
                      setStep("choose");
                      setEmail("");
                      setPassword("");
                    }}
                    className="text-sm text-gray-500 hover:underline"
                    type="button"
                  >
                    Change role
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <label className="block">
                    <span className="text-base font-medium text-gray-700">Email</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0b6ff0]"
                      aria-label="Email"
                    />
                  </label>

                  <label className="block relative">
                    <span className="text-base font-medium text-gray-700">Password</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0b6ff0] pr-28"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-12 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </label>

                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={role}
                      readOnly
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-3 bg-white text-lg text-gray-700"
                      aria-label="Role"
                    />
                    <label className="inline-flex items-center gap-2 text-lg text-gray-700">
                      <input type="checkbox" className="w-5 h-5" />
                      <span>Remember me</span>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl text-lg font-bold text-white"
                      style={{
                        background: "linear-gradient(90deg,#0b6ff0,#0f4fcf)",
                        boxShadow: "0 8px 20px rgba(11,111,240,0.18)",
                        opacity: loading ? 0.75 : 1,
                      }}
                    >
                      {loading ? "Signing in..." : "Login"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-base text-gray-600">
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      disabled={loading}
                      className="text-[#0b6ff0] hover:underline"
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("Password reset flow (implement)")}
                      disabled={loading}
                      className="text-gray-500 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </div>

               
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
