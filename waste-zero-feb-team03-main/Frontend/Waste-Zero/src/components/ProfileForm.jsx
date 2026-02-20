import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProfileForm() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    skills: []
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/me", form);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Name</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email Address</label>
        <div className="relative">
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg bg-gray-50 dark:bg-gray-600 cursor-not-allowed focus:outline-none transition-all"
            value={form.email}
            disabled
            placeholder="your@email.com"
          />
          <div className="absolute right-3 top-3 text-gray-400">\ud83d\udd12</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed for security reasons</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Location</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="City, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Skills</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={form.skills.join(', ')}
          onChange={(e) => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="e.g., Recycling, Teamwork, Driving"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with commas</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Bio / About You</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
          rows="4"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell us about yourself and your volunteer interests..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold">
          Cancel
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
          Save Changes
        </button>
      </div>

    </form>
  );
}

