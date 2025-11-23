import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
import Login from "./pages/Guardian/Login";
//import Header from "./components/header";
import HealthRecordManage from "./pages/Guardian/HealthRecordManage";
import MedicationManage from "./pages/Guardian/Reminder";
import MyCareRequests from "./pages/Guardian/CareGiverRequest";
import ChatBot from "./components/chatbot";
import Profile from "./pages/Guardian/Profile";
import ElderProfileForm from "./pages/Guardian/ElderProfileList";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/Guardian/SignUp"; 
import { i } from "framer-motion/client";
import Test from "./pages/Guardian/test";


function App() {
  return (
    <BrowserRouter>
      {/* Toaster should be placed here, outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />
      
        <Routes>

        <Route path="/guardiandashboard" element={<GuardianDashboard />} />
        <Route path="/healthRecord" element={<HealthRecordManage />} />
        <Route path="/medicationmanage" element={<MedicationManage />} />
        <Route path="/carerequest" element={<MyCareRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profilelist" element={<ElderProfileForm />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/test" element={<Test />} /> 
        

        {/* You can add more routes like dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
