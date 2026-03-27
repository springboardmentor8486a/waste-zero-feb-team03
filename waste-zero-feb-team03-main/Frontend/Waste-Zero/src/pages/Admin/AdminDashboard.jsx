import { useState, useEffect } from "react";
import { Users, Briefcase, Activity, Clock, Shield, AlertCircle } from "lucide-react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                // adminService.getOverview() calls GET /admin/overview
                const response = await adminService.getOverview();
                
                // FIX: Your backend returns { success: true, data: { ... } }
                // We must access response.data.data to get the actual metrics
                if (response.data && response.data.success) {
                    setStats(response.data.data);
                } else {
                    // Fallback if the structure is slightly different
                    setStats(response.data || response);
                }
            } catch (err) {
                setError("Failed to load dashboard statistics. Check your backend connection.");
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">Loading metrics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Platform metrics and recent activities</p>
                </header>

                {/* Summary Cards - Data Mapping Fix applied here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        icon={Users} 
                        title="Total Users" 
                        value={stats?.totalUsers || 0} 
                        color="text-blue-500" 
                        bgColor="bg-blue-50 dark:bg-blue-900/20" 
                    />
                    <StatCard 
                        icon={Shield} 
                        title="Active NGOs" 
                        value={stats?.activeNGOs || 0} 
                        color="text-emerald-500" 
                        bgColor="bg-emerald-50 dark:bg-emerald-900/20" 
                    />
                    <StatCard 
                        icon={Users} 
                        title="Active Volunteers" 
                        value={stats?.activeVolunteers || 0} 
                        color="text-purple-500" 
                        bgColor="bg-purple-50 dark:bg-purple-900/20" 
                    />
                    <StatCard 
                        icon={Briefcase} 
                        title="Opportunities" 
                        value={stats?.totalOpportunities || 0} 
                        color="text-amber-500" 
                        bgColor="bg-amber-50 dark:bg-amber-900/20" 
                    />
                </div>

                {/* Recent Activity Section */}
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
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {log.user_id?.name || 'Admin'} 
                                                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                                                    {log.action}
                                                </span>
                                            </p>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {log.metadata?.target_user_id && (
                                                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                    User: {log.metadata.target_user_id.name || log.metadata.target_user_id.email}
                                                </span>
                                            )}
                                            {log.metadata?.target_opportunity_id && (
                                                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                                                    Opp: {log.metadata.target_opportunity_id.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center">
                                <Activity size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">No live activity detected yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} ${color} shrink-0`}>
            <Icon size={26} />
        </div>
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
