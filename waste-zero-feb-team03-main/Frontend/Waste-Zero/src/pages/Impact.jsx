import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Trees, Users, Recycle, Trophy, TrendingUp, Calendar, Award } from "lucide-react";

// Mock impact data to make the dashboard look dynamic
const MOCK_IMPACT = {
    treesSaved: 142,
    wasteDivertedKg: 850,
    volunteerHours: 36,
    eventsAttended: 12,
    carbonOffset: "1.2 Tons",
    recentBadges: [
        { title: "Waste Warrior", icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", date: "2 days ago" },
        { title: "Early Bird", icon: Calendar, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", date: "1 week ago" },
        { title: "Community Pillar", icon: Users, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", date: "2 weeks ago" }
    ]
};

const ImpactItem = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
                    <TrendingUp size={12} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    </div>
);

const Impact = () => {
    const { user } = useAuth();
    const [data, setData] = useState(MOCK_IMPACT);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto">

                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Impact</h1>
                            <p className="text-gray-500 mt-2">Track your environmental contribution and community efforts, {user?.name?.split(' ')[0] || 'User'}!</p>
                        </div>
                        <div className="hidden md:flex items-center bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-4 py-2 rounded-lg font-semibold border border-emerald-100 dark:border-emerald-800">
                            <Award size={18} className="mr-2" />
                            Current Rank: Eco-Champion
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ImpactItem
                            title="Waste Diverted (kg)"
                            value={data.wasteDivertedKg}
                            icon={Recycle}
                            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                            trend="+12%"
                        />
                        <ImpactItem
                            title="Trees Equivalent"
                            value={data.treesSaved}
                            icon={Trees}
                            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                            trend="+5"
                        />
                        <ImpactItem
                            title="Volunteer Hours"
                            value={data.volunteerHours}
                            icon={Users}
                            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                            trend="+4.5h"
                        />
                        <ImpactItem
                            title="Events Attended"
                            value={data.eventsAttended}
                            icon={Calendar}
                            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Environmental Savings Info Graphic */}
                        <div className="lg:col-span-2 bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
                            <div className="relative z-10 w-full md:w-2/3">
                                <h2 className="text-2xl font-bold mb-4">You are making a difference!</h2>
                                <p className="text-emerald-100 mb-6 leading-relaxed">
                                    Since joining WasteZero, your contributions have directly offset approximately <strong className="text-white">{data.carbonOffset}</strong> of CO2 emissions.
                                    That is structurally equivalent to taking a standard car off the road for an entire month. Keep up the amazing work!
                                </p>
                                <button className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                                    Share Milestone
                                </button>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500 rounded-full opacity-50 blur-2xl"></div>
                        </div>

                        {/* Badges / Achievements List */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Trophy size={20} className="mr-2 text-amber-500" />
                                Recent Badges
                            </h3>

                            <div className="space-y-4">
                                {data.recentBadges.map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${badge.bg} ${badge.color}`}>
                                            <badge.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{badge.title}</h4>
                                            <p className="text-xs text-gray-500">{badge.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-6 py-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-gray-100 dark:border-gray-700">
                                View All Achievements
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Impact;
