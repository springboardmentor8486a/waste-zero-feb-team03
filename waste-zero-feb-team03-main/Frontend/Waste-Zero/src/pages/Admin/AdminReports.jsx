import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Download, Loader2, AlertCircle, TrendingUp, Users, CheckCircle } from "lucide-react";

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (from) params.from = from;
            if (to)   params.to   = to;

            const response = await adminService.getReports(params);
            setReports(response.data?.data || response.data || null);
        } catch (err) {
            setError("Failed to fetch report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const downloadCSV = () => {
        if (!reports) return alert("No data available to export.");

        let csv = "data:text/csv;charset=utf-8,";
        csv += "Category,Label,Count\n";

        reports.usersByRole?.forEach(r => {
            csv += `User distribution,${r._id},${r.count}\n`;
        });
        reports.opportunitiesByStatus?.forEach(r => {
            csv += `Opportunity status,${r._id},${r.count}\n`;
        });
        reports.volunteerResponse?.byOpportunity?.forEach(r => {
            csv += `Volunteer response,"${r.title}",${r.total} total / ${r.accepted} accepted / ${r.acceptanceRate}%\n`;
        });

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", `WasteZero_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (loading) return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">

                {/* Header */}
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
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

                {/* Date range filter */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">From</label>
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">To</label>
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button
                        onClick={fetchReports}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all"
                    >
                        Apply
                    </button>
                    {(from || to) && (
                        <button
                            onClick={() => { setFrom(""); setTo(""); setTimeout(fetchReports, 0); }}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* User role distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users size={18} className="text-blue-500" /> User Roles
                        </h2>
                        <div className="space-y-4">
                            {reports?.usersByRole?.map((r, i) => {
                                const total = reports.usersByRole.reduce((a, c) => a + c.count, 0);
                                const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : 0;
                                const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500"];
                                return (
                                    <div key={r._id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{r.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Opportunity status distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-amber-500" /> Opportunities by Status
                        </h2>
                        <div className="space-y-4">
                            {reports?.opportunitiesByStatus?.map((r, i) => {
                                const total = reports.opportunitiesByStatus.reduce((a, c) => a + c.count, 0);
                                const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : 0;
                                const colors = ["bg-amber-500", "bg-emerald-500", "bg-gray-400"];
                                return (
                                    <div key={r._id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{r._id}</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{r.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Volunteer response metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle size={18} className="text-emerald-500" /> Volunteer Response
                        </h2>
                        <div className="flex gap-4 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Total applications: <span className="font-bold text-gray-900 dark:text-white">{reports?.volunteerResponse?.totalApplications ?? 0}</span>
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                Platform acceptance rate: <span className="font-bold text-emerald-600">{reports?.volunteerResponse?.platformAcceptanceRate ?? 0}%</span>
                            </span>
                        </div>
                    </div>

                    {!reports?.volunteerResponse?.byOpportunity?.length ? (
                        <p className="text-center text-gray-400 py-8 text-sm">No application data available for this period.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 tracking-wider">
                                        <th className="pb-3 font-semibold">Opportunity</th>
                                        <th className="pb-3 font-semibold text-center">Total</th>
                                        <th className="pb-3 font-semibold text-center">Accepted</th>
                                        <th className="pb-3 font-semibold text-center">Rejected</th>
                                        <th className="pb-3 font-semibold text-center">Pending</th>
                                        <th className="pb-3 font-semibold text-center">Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {reports.volunteerResponse.byOpportunity.map((r) => (
                                        <tr key={r.opportunityId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="py-3 font-medium text-gray-900 dark:text-white">{r.title}</td>
                                            <td className="py-3 text-center text-gray-600 dark:text-gray-300">{r.total}</td>
                                            <td className="py-3 text-center">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{r.accepted}</span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="text-red-500 dark:text-red-400 font-semibold">{r.rejected}</span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="text-amber-500 dark:text-amber-400 font-semibold">{r.pending}</span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    r.acceptanceRate >= 50
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {r.acceptanceRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminReports;
