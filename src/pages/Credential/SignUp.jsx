import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Use the provided image path. If your bundler doesn't accept this absolute path,
// replace it with a public path like "/images/illustration.png" or import the file.
const illustration = "/mnt/data/8158b188-00cf-4ef0-8462-a7ccc7c247bd.png";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Elder");
  const [coNumber, setCoNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?\d{7,15}$/;

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

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left illustration panel */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-10">
          <div className="w-[85%]">
            <img
              src={illustration}
              alt="illustration"
              className="w-full h-auto select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Right form panel */}
        <div className="relative p-10 md:p-14">
          {/* top-right small sign in */}
          <div className="absolute right-6 top-6 text-sm text-gray-500">
             
            
          </div>

          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Signup</h1>
             <br></br><br/>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="focus001@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="8+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  disabled={loading}
                />
              </div>

              {/* Role + Contact in grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-gray-600 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    disabled={loading}
                  >
                    <option value="Elder">Elder</option>
                    <option value="Admin">Admin</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-sm text-gray-600 mb-2">Contact</label>
                  <input
                    type="tel"
                    placeholder="+9477xxxxxxx"
                    value={coNumber}
                    onChange={(e) => setCoNumber(e.target.value)}
                    className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full rounded-full py-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg hover:scale-[1.01] transition transform disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>




              <div className="text-center text-sm font-bold text-gray-500">
                Already have an account?  {  
              <button
                type="button"
                onClick={() => navigate("/login")}
                className=" text-[15px] text-[#521cda] hover:underline cursor-pointer"
              >
                  Login
              </button>
            }
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
