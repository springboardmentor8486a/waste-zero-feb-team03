import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Leaf, Lock, EyeOff, Eye } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState(""); // loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setStatus("loading");
        try {
            const response = await api.put(`/auth/resetpassword/${token}`, { password });

            // Auto-login the user after successful reset
            const data = response.data;
            if (data.role) data.role = data.role.toLowerCase();
            login({ token: data.token, user: data });

            setStatus("success");
            setTimeout(() => {
                if (data.role === "ngo") {
                    navigate("/dashboard/ngo");
                } else {
                    navigate("/dashboard/volunteer");
                }
            }, 2000);

        } catch (error) {
            setStatus("error");
            alert(error.response?.data?.message || "Failed to reset password. Link may be expired.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 font-sans">
            <div className="max-w-md w-full flex flex-col items-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 transform transition-all relative">

                <Link to="/" className="flex items-center gap-2 mb-8 hover:scale-105 transition-transform origin-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">Waste-Zero</h1>
                </Link>

                {status === "success" ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-emerald-600 dark:text-emerald-500">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your password has been changed successfully. Redirecting you to the dashboard...
                        </p>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="mb-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">New Password</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Please enter your new strong password below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
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
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                {password !== confirmPassword && confirmPassword.length > 0 && (
                                    <p className="text-red-500 text-xs ml-1 mt-1">Passwords do not match.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] mt-4 disabled:opacity-50"
                            >
                                {status === "loading" ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
