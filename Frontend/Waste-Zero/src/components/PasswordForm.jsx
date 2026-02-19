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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">

      <div className="mb-4">
        <label className="block text-sm mb-1">Current Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">New Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
        />
      </div>

      <button className="bg-emerald-600 text-white px-4 py-2 rounded">
        Update Password
      </button>

    </form>
  );
}
