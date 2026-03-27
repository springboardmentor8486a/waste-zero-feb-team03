import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Download, Loader2, AlertCircle } from "lucide-react";

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const data = await adminService.getReports();
                // Ensure we are setting an object even if data.data is undefined
                setReports(data.data || data);
            } catch (err) {
                setError("Failed to fetch report data. Ensure your backend route /admin/reports is active.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const downloadCSV = () => {
        // Guard clause to prevent errors if reports aren't loaded
        if (!reports || !reports.usersByRole || !reports.opportunitiesByStatus) {
            alert("No data available to export.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Report Category,Type/Status,Count\n"; // Proper Headers

        reports.usersByRole.forEach(row => {
            csvContent += `User Distribution,${row._id},${row.count}\n`;
        });

        reports.opportunitiesByStatus.forEach(row => {
            csvContent += `Opportunity Status,${row._id},${row.count}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `WasteZero_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (loading) return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <p>Generating Analytics...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                        <p className="text-gray-500 mt-1">Platform growth and functional breakdown</p>
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
                    >
                        <Download size={18} /> Download CSV
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Roles Distribution</h2>
                        <div className="space-y-4">
                            {reports?.usersByRole?.map((r, i) => {
                                const total = reports.usersByRole.reduce((acc, curr) => acc + curr.count, 0);
                                const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : 0;
                                const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500"];
                                
                                return (
                                    <div key={r._id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{r.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-1000`} 
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Opportunity Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Opportunities by Status</h2>
                        <div className="space-y-4">
                            {reports?.opportunitiesByStatus?.map((r, i) => {
                                const total = reports.opportunitiesByStatus.reduce((acc, curr) => acc + curr.count, 0);
                                const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : 0;
                                const colors = ["bg-amber-500", "bg-emerald-500", "bg-gray-400"];
                                
                                return (
                                    <div key={r._id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{r.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-1000`} 
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
