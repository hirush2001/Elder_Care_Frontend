import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[role, setRole] = useState("user"); 

}

async function handleLogin() {

try {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/login", {
        email: email,
        password: password,
        role : role
    });

    toast.success("Login successful!");
    console.log( response.data)
    localStorage.setItem("token", response.data.token);

    if (role === "admin") {
    window.location.href = "/admin";
} 
else if (role === "doctor") {
    window.location.href = "/doctor";
}
else if (role === "patient") {
    window.location.href = "/patient";
} 

} catch (error) {
    toast.error(e.response.data.message || "Login failed. Please try again.");
}

return (

<div className="w-full h-screen bg-[url('/final.webp')] bg-center bg-cover flex justify-evenly items-center">
    <div className="w-[50%] h-full"></div>

    <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[300px] backdrop-blur-md rounded-[20px] shadow-2xl my-[20px] flex flex-col justify-center items-center">
        <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-3"
        />

        <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-3"
        />

        <button
            onClick={handleLogin}
            className="w-[300px] h-[50px] bg-[#c3efe9] rounded-[20px] text-[20px] font-bold text-white my-[20px] cursor-pointer"
        >
            Login
        </button>
        </div>
      </div>
    </div>
  );
}

