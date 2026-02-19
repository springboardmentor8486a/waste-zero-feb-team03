import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProfileForm() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    bio: ""
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

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">

      <div className="mb-4">
        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Location</label>
        <input
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Bio</label>
        <textarea
          className="w-full border p-2 rounded"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <button className="bg-emerald-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>

    </form>
  );
}

