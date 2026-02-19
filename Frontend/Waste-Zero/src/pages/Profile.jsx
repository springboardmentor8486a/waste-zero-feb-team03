import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";

export default function Profile() {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-teal-50">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <div className="p-8">

          <h1 className="text-2xl font-semibold mb-1">
            My Profile
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Update your personal information and security settings.
          </p>

          <div className="flex gap-4 mb-6">

            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-lg text-sm
              ${activeTab === "profile"
                  ? "bg-white shadow"
                  : "bg-transparent"}`}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-2 rounded-lg text-sm
              ${activeTab === "password"
                  ? "bg-white shadow"
                  : "bg-transparent"}`}
            >
              Password
            </button>

          </div>

          {activeTab === "profile" && <ProfileForm />}
          {activeTab === "password" && <PasswordForm />}

        </div>
      </div>
    </div>
  );
}
