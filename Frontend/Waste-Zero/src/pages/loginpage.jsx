import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user); // Save to context
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-5xl w-full flex bg-white shadow-xl rounded-2xl overflow-hidden m-4">
        
        {/* Left Side: Branding (Green Theme) */}
        <div className="hidden md:flex md:w-1/2 bg-emerald-600 p-12 flex-col justify-center text-white">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">♻️</span>
            <h1 className="text-2xl font-bold tracking-tight">WasteZero</h1>
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Join the Recycling Revolution</h2>
          <p className="text-emerald-100 mb-8 opacity-90">
            WasteZero connects volunteers, NGOs, and administrators to schedule pickups and make a positive impact.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/30 p-2 rounded-lg">📅</span>
              <p className="text-sm font-medium">Easily arrange waste collection</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/30 p-2 rounded-lg">📈</span>
              <p className="text-sm font-medium">Monitor your environmental contribution</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200 mb-8">
            <button className="flex-1 pb-4 text-emerald-600 border-b-2 border-emerald-600 font-semibold">Login</button>
            <Link to="/register" className="flex-1 pb-4 text-gray-400 text-center hover:text-gray-600">Register</Link>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">Login to your account</h3>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Your password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md shadow-emerald-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
