import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";

export default function Profile() {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <div className="p-8">

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your personal information and account settings</p>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === "profile"
                    ? "text-emerald-600 border-emerald-600"
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Profile Information
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === "password"
                    ? "text-emerald-600 border-emerald-600"
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Password
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {activeTab === "profile" && <ProfileForm />}
              {activeTab === "password" && <PasswordForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
