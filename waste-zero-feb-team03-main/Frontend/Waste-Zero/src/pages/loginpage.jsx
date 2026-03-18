import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Leaf, Lock, Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      if (data.role) data.role = data.role.toLowerCase();
      login({ token: data.token, user: data });
      if (data.role === "ngo") {
        navigate("/dashboard/ngo");
      } else {
        navigate("/dashboard/volunteer");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Unknown error";
      alert("Login failed: " + msg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus("sending...");
    try {
      await api.post("/auth/forgotpassword", { email: forgotEmail });
      setForgotStatus("sent");
    } catch (err) {
      setForgotStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 font-sans selection:bg-emerald-500/30">
      {/* Background Shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl w-full flex bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-gray-800 transition-all">
        {/* Left Side: Dynamic Branding */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12 hover:scale-105 transition-transform origin-left">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Waste-Zero</h1>
            </Link>

            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Welcome Back to the <br />
              <span className="text-emerald-200">Revolution.</span>
            </h2>
            <p className="text-emerald-50/80 text-lg mb-8 leading-relaxed">
              Continue your journey in rescuing surplus food and supporting your local community.
            </p>

            <div className="space-y-6">
              {[
                { icon: "📅", text: "Schedule your waste pickups effortlessly" },
                { icon: "♻️", text: "Categorize plastic, organic, & e-waste" },
                { icon: "🚛", text: "Dynamic agent assignment & tracking" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-medium text-emerald-50">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 text-sm text-emerald-100/60">
            © 2026 Waste-Zero Initiative. <br />
            Together, making every meal count.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 font-medium transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Sign In</h3>
            <p className="text-gray-500 dark:text-gray-400">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] mt-4"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Join the movement
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 transform transition-all relative">

            <button
              onClick={() => { setShowForgot(false); setForgotStatus(""); setForgotEmail(""); }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {forgotStatus === "sent" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm border border-emerald-100 dark:border-emerald-800">
                  ✅ Password reset email correctly sent! Check your inbox.
                </div>
              )}
              {forgotStatus === "error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800">
                  ❌ User not found or server error.
                </div>
              )}

              <button
                type="submit"
                disabled={forgotStatus === "sending..." || forgotStatus === "sent"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                {forgotStatus === "sending..." ? "Sending..." : forgotStatus === "sent" ? "Email Sent" : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
