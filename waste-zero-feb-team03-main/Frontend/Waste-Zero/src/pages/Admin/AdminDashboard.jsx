import { useState, useEffect } from "react";
import { Users, Briefcase, Activity, ExternalLink } from "lucide-react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const data = await adminService.getOverview();
                setStats(data.data);
            } catch (err) {
                setError("Failed to load dashboard statistics.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    if (loading) return <div className="p-8 flex items-center justify-center min-h-screen text-gray-500">Loading admin dashboard...</div>;
    if (error) return <div className="p-8 flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Platform metrics and recent activities</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={Users} title="Total Users" value={stats?.totalUsers || 0} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                    <StatCard icon={Activity} title="Active NGOs" value={stats?.activeNGOs || 0} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
                    <StatCard icon={Users} title="Active Volunteers" value={stats?.activeVolunteers || 0} color="text-purple-500" bgColor="bg-purple-50 dark:bg-purple-900/20" />
                    <StatCard icon={Briefcase} title="Opportunities" value={stats?.totalOpportunities || 0} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" />
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Admin Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {stats?.recentLogs && stats.recentLogs.length > 0 ? (
                            stats.recentLogs.map((log) => (
                                <div key={log._id} className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <Activity size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {log.user_id?.name || 'System Admin'} <span className="text-gray-500 dark:text-gray-400 font-normal">performed action</span>: {log.action}
                                        </p>
                                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            {log.metadata?.target_user_id && (
                                                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    Target User: {log.metadata.target_user_id.name || log.metadata.target_user_id.email}
                                                </span>
                                            )}
                                            {log.metadata?.target_opportunity_id && (
                                                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    Target Opportunity: {log.metadata.target_opportunity_id.title}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bgColor} ${color}`}>
            <Icon size={26} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
