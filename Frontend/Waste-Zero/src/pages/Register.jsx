import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    role: "volunteer",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role === "ngo" ? "NGO" : "volunteer",
        location: form.location,
      };
      await api.post("/auth/register", payload);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert("Registration failed: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 transition-colors duration-300">
      <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden transition-colors duration-300">

        {/* Left */}
        <div
          className="p-10 text-white flex flex-col justify-center bg-cover bg-center relative"
          style={{ backgroundImage: "url('/assets/auth-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-4">Create Account</h1>
            <p className="text-sm">Become a part of the WasteZero sustainability network.</p>
          </div>
        </div>

        {/* Right */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Full name"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Email"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Location"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
            </select>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Password"
              required
            />
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Confirm password"
              required
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/" className="text-emerald-600 ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
