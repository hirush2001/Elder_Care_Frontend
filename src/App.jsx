import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
import Login from "./pages/Guardian/Login";
import HealthRecordManage from "./pages/Guardian/HealthRecordManage";
import MedicationManage from "./pages/Guardian/Reminder";
import MyCareRequests from "./pages/Guardian/CareGiverRequest";
import ChatBot from "./components/chatbot";
import Profile from "./pages/Guardian/Profile";
import ElderProfileForm from "./pages/Guardian/ElderProfileList";
import CaregiverDashboard from "./pages/CareGiver/CareGiverDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* Toaster should be placed here, outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
      
        
        <Route path="/" element={<Login />} />
        <Route path="/guardiandashboard" element={<GuardianDashboard />} />
        <Route path="/healthRecord" element={<HealthRecordManage />} />
        <Route path="/medicationmanage" element={<MedicationManage />} />
        <Route path="/carerequest" element={<MyCareRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profilelist" element={<ElderProfileForm />} />
        <Route path="/caregiverdashboard" element={<CaregiverDashboard />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/login" element={<Login />} />

        {/* You can add more routes like dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
