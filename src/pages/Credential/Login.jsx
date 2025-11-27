import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  // --------------------------
  // ROLE OPTIONS
  // --------------------------
  const roles = [
    {
      id: "Elder",
      title: "Elder",
      desc: "Access your care details, health reports and appointments.",
      accent: "#0b6ff0",
    },
    {
      id: "Caregiver",
      title: "Caregiver",
      desc: "Manage elder care, daily routines and engagement tasks.",
      accent: "#0f6f5e",
    },
    {
      id: "Admin",
      title: "Admin",
      desc: "Full access to system admin controls and dashboards.",
      accent: "#eab308",
    },
  ];

  // --------------------------
  // STATES
  // --------------------------
  const [step, setStep] = useState("choose");
  const [role, setRole] = useState("Elder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const onChooseRole = (selected) => {
    setRole(selected);
    setStep("login");
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f8ff] flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* LEFT IMAGE SECTION */}
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

        
        <main className="lg:col-span-8 bg-white rounded-3xl shadow-xl p-8 flex flex-col">

          
          <header className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#07325a]">
              Welcome
            </h1>
          </header>

          <div className="flex-1 flex flex-col lg:flex-row gap-8">

            
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
                    className="flex items-center gap-4 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                    aria-label={`Continue as ${r.title}`}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: r.accent }}
                    >
                      {r.title[0]}
                    </div>

                    <div className="text-left">
                      <h3 className="text-2xl font-semibold text-[#063d66]">{r.title}</h3>
                      <p className="mt-1 text-lg text-gray-600">{r.desc}</p>
                    </div>

                    
                    {role === r.id && (
                      <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#e6f6f1] text-[#0f6f5e]">
                          Selected
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            
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
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-4 text-lg focus:ring-2 focus:ring-[#0b6ff0]"
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
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-4 text-lg pr-28 focus:ring-2 focus:ring-[#0b6ff0]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-12 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm"
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
                    />
                    <label className="inline-flex items-center gap-2 text-lg text-gray-700">
                      <input type="checkbox" className="w-5 h-5" />
                      <span>Remember me</span>
                    </label>
                  </div>

                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl text-lg font-bold text-white"
                    style={{
                      background: "linear-gradient(90deg,#0b6ff0,#0f4fcf)",
                      opacity: loading ? 0.75 : 1,
                    }}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>

                  
                  <div className="flex items-center justify-between text-base text-gray-600">
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="text-[#0b6ff0] hover:underline"
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("Password reset flow (implement)")}
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
