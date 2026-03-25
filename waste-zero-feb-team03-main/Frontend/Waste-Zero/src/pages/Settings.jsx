import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Bell, Lock, Globe, User, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-gray-500 mt-2">Manage your account preferences and configurations.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-64 flex shrink-0 flex-col gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === tab.id
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                        : 'text-gray-600 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 min-h-[400px]">

                                {activeTab === 'account' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Preferences</h2>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</p>
                                            <select className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                                                <option>English</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</p>
                                            <select className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                                                <option>(UTC +05:30) Indian Standard Time</option>
                                            </select>
                                        </div>
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg mt-4 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                                        {['Email notifications', 'Push notifications', 'SMS alerts', 'Weekly digest'].map(item => (
                                            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 relative">
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">{item}</p>
                                                    <p className="text-xs text-gray-500">Receive updates regarding {item.toLowerCase()}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security</h2>
                                        <button className="w-full py-3 px-4 text-left border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <p className="font-bold text-gray-800 dark:text-gray-200">Change Password</p>
                                            <p className="text-sm text-gray-500">Update your account password</p>
                                        </button>
                                        <button className="w-full py-3 px-4 text-left border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <p className="font-bold text-gray-800 dark:text-gray-200">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                        </button>
                                        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                                            <button className="text-red-500 font-medium hover:text-red-600 transition-colors">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'appearance' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
                                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                                                <p className="text-sm text-gray-500">Toggle application theme</p>
                                            </div>
                                            <button
                                                onClick={toggleTheme}
                                                className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Toggle Theme
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
