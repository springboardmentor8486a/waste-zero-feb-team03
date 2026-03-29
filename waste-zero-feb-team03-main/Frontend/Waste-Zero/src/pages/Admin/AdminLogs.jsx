import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { ScrollText, ChevronLeft, ChevronRight, Clock, Loader2, AlertCircle } from "lucide-react";

const LIMIT = 15;

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getLogs({ page, limit: LIMIT });
            setLogs(response.data?.data || []);
            setTotal(response.data?.total || 0);
        } catch (err) {
            setError("Failed to load activity logs.");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    const timeAgo = (ts) => {
        const diff = Date.now() - new Date(ts).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);
        if (mins  < 1)  return "just now";
        if (mins  < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const actionColor = (action = "") => {
        if (action.toLowerCase().includes("delete"))  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        if (action.toLowerCase().includes("suspend")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        if (action.toLowerCase().includes("active"))  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ScrollText className="text-emerald-500" size={28} />
                        Activity Logs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        All admin actions — {total} total
                    </p>
                </div>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {/* Log table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">Admin</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">Action</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">Target</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700 text-right">When</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <Loader2 className="animate-spin text-emerald-500 mx-auto" size={28} />
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center text-gray-400 italic">
                                        No admin actions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">

                                        {/* Admin */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm shrink-0">
                                                    {log.user_id?.name?.charAt(0).toUpperCase() || "A"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {log.user_id?.name || "Admin"}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{log.user_id?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${actionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>

                                        {/* Target */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {log.metadata?.target_user_id && (
                                                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded inline-flex w-fit">
                                                        User: {log.metadata.target_user_id.name || log.metadata.target_user_id.email}
                                                    </span>
                                                )}
                                                {log.metadata?.target_opportunity_id && (
                                                    <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 px-2 py-0.5 rounded inline-flex w-fit">
                                                        Opp: {log.metadata.target_opportunity_id.title}
                                                    </span>
                                                )}
                                                {!log.metadata?.target_user_id && !log.metadata?.target_opportunity_id && (
                                                    <span className="text-xs text-gray-400 italic">—</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Timestamp */}
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Clock size={11} />
                                                    {timeAgo(log.createdAt)}
                                                </span>
                                                <span className="text-[10px] text-gray-300 dark:text-gray-600">
                                                    {new Date(log.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-400">
                                Page {page} of {totalPages} — {total} logs
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
