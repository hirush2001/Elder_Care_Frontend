import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
import Login from "./pages/Guardian/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* Toaster should be placed here, outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
      
        

        <Route path="/guardiandashboard" element={<GuardianDashboard />} />
        <Route path="/login" element={<Login />} />

        {/* You can add more routes like dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
