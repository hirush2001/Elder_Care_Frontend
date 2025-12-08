import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
//import Login from "./pages/Guardian/Login";
import HealthRecordManage from "./pages/Guardian/HealthRecordManage";
import MedicationManage from "./pages/Guardian/Reminder";
import MyCareRequests from "./pages/Guardian/CareGiverRequest";
import ChatBot from "./components/ChatBot";
import Profile from "./pages/Guardian/Profile";
import ElderProfileForm from "./pages/Guardian/ElderProfileList";
import CaregiverProfileForm from "./pages/CareGiver/CareGiverProfile";
import AdminProfileForm from "./pages/Admin/AdminProfile";
import CaregiverDashboard from "./pages/CareGiver/CareGiverDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Testpage from "./pages/Admin/test";
import Login from "./pages/Credential/Login";
import Signup from "./pages/Credential/Signup";
import Cprofile from "./pages/CareGiver/Cprofile";
import Aprofile from "./pages/Admin/Aprofile";


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
        <Route path="/cprofile" element={<Cprofile />} />
        <Route path="/aprofile" element={<Aprofile />} />
        <Route path="/cprofilelist" element={<CaregiverProfileForm />} />
        <Route path="/profilelist" element={<ElderProfileForm />} />
        <Route path="/aprofilelist" element={<AdminProfileForm />} />
        <Route path="/caregiverdashboard" element={<CaregiverDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Testpage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        

        {/* You can add more routes like dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
