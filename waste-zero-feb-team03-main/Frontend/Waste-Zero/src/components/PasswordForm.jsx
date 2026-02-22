import { useState } from "react";
import api from "../services/api";

export default function PasswordForm() {

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/change-password", form);
      alert("Password updated successfully");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password update failed:", err);

      const message = err.response?.data?.message || "Password update failed";
      alert(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Current Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          placeholder="Enter your current password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">New Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
          placeholder="Enter your new password"
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 8 characters long</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-400"><strong>Password Tips:</strong></p>
        <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4 list-disc">
          <li>Use a mix of uppercase and lowercase letters</li>
          <li>Include numbers and special characters</li>
          <li>Make it at least 8 characters long</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={() => setForm({ currentPassword: "", newPassword: "" })} className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold">
          Clear
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
          Change Password
        </button>
      </div>

    </form>
  );
}
