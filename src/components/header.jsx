import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO + TITLE */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
            EC
          </div>

          <div>
            <h1 className="text-white text-xl font-semibold">
              Elder Care System
            </h1>
            <p className="text-white/70 text-sm -mt-1">
              Care, Comfort & Companionship
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5">
          <button
            onClick={() => navigate("/")}
            className="text-white/90 hover:text-white hover:underline transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/services")}
            className="text-white/90 hover:text-white hover:underline transition"
          >
            Services
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="text-white/90 hover:text-white hover:underline transition"
          >
            Contact
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
