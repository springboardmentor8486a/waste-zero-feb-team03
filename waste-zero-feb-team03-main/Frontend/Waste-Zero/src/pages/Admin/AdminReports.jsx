import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Download } from "lucide-react";

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await adminService.getReports();
                setReports(data.data);
            } catch (err) {
                setError("Failed to fetch report data");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const downloadCSV = () => {
        if (!reports) return;

        // A simple CSV generation example
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Type,Category,Count\n";

        reports.usersByRole.forEach(row => {
            csvContent += `User Role,${row._id},${row.count}\n`;
        });

        reports.opportunitiesByStatus.forEach(row => {
            csvContent += `Opportunity Status,${row._id},${row.count}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "wastezero_admin_report.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (loading) return <div className="p-8 flex items-center justify-center min-h-screen text-gray-500">Loading reports...</div>;

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
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Download size={18} /> Download CSV
                    </button>
                </div>

                {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Roles Distribution</h2>
                        <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                            <table className="w-full text-left">
                                <tbody>
                                    {reports?.usersByRole.map(r => (
                                        <tr key={r._id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="py-3 font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</td>
                                            <td className="py-3 text-right">
                                                <span className="font-bold text-gray-900 dark:text-white">{r.count}</span>
                                                <span className="text-sm text-gray-500 ml-2">users</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Simple CSS Visual */}
                        <div className="flex h-4 bg-gray-100 dark:bg-gray-800 rounded-full mt-6 overflow-hidden">
                            {reports?.usersByRole.map((r, i) => {
                                const total = reports.usersByRole.reduce((acc, curr) => acc + curr.count, 0);
                                const pct = total > 0 ? (r.count / total) * 100 : 0;
                                const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500"];
                                return <div key={r._id} style={{ width: `${pct}%` }} className={colors[i % colors.length]} title={`${r._id}: ${pct.toFixed(1)}%`}></div>
                            })}
                        </div>
                    </div>

                    {/* Opportunity Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Opportunities by Status</h2>
                        <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                            <table className="w-full text-left">
                                <tbody>
                                    {reports?.opportunitiesByStatus.map(r => (
                                        <tr key={r._id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="py-3 font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</td>
                                            <td className="py-3 text-right">
                                                <span className="font-bold text-gray-900 dark:text-white">{r.count}</span>
                                                <span className="text-sm text-gray-500 ml-2">posts</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Simple CSS Visual */}
                        <div className="flex h-4 bg-gray-100 dark:bg-gray-800 rounded-full mt-6 overflow-hidden">
                            {reports?.opportunitiesByStatus.map((r, i) => {
                                const total = reports.opportunitiesByStatus.reduce((acc, curr) => acc + curr.count, 0);
                                const pct = total > 0 ? (r.count / total) * 100 : 0;
                                const colors = ["bg-amber-500", "bg-emerald-500", "bg-gray-500"];
                                return <div key={r._id} style={{ width: `${pct}%` }} className={colors[i % colors.length]} title={`${r._id}: ${pct.toFixed(1)}%`}></div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
