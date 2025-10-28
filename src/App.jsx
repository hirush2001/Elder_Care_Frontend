import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./client/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* Toaster should be placed here, outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
      
        {/* Optional /login route */}
        <Route path="/login" element={<LoginPage />} />
        {/* You can add more routes like dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
