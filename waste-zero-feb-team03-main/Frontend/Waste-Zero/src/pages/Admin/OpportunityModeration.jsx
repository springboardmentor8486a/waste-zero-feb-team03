import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Search, MapPin, Trash2, Loader2, AlertCircle, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast"; // Recommended for activity feedback

const OpportunityModeration = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted
    const [filters, setFilters] = useState({ status: "", location: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOpportunities();
    }, [filters]);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const data = await adminService.getOpportunities(filters);
            setOpportunities(data.data || data);
            setError(null);
        } catch (err) {
            setError("Failed to connect to the server. Please check your backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete: "${title}"?`)) return;

        setDeletingId(id); // Set loading state for this specific button
        try {
            await adminService.deleteOpportunity(id);
            setOpportunities(prev => prev.filter(o => o._id !== id));
            
            // This is the "Activity" feedback!
            toast.success("Opportunity removed and activity logged."); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" /> Opportunity Moderation
                        </h1>
                        <p className="text-gray-500 mt-1">Review and manage platform activities</p>
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Showing {opportunities.length} opportunities
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[260px] focus-within:ring-2 ring-emerald-500/20 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by location..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-200"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                    </div>

                    <select
                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 ring-emerald-500/20"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="open">🟢 Open</option>
                        <option value="in-progress">🟡 In-Progress</option>
                        <option value="closed">🔴 Closed</option>
                    </select>
                </div>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {/* Main Table Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-semibold border-b border-gray-100 dark:border-gray-700">Title & Organization</th>
                                    <th className="py-4 px-6 font-semibold border-b border-gray-100 dark:border-gray-700">Location</th>
                                    <th className="py-4 px-6 font-semibold border-b border-gray-100 dark:border-gray-700">Status</th>
                                    <th className="py-4 px-6 font-semibold border-b border-gray-100 dark:border-gray-700">Date Posted</th>
                                    <th className="py-4 px-6 font-semibold text-right border-b border-gray-100 dark:border-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                                                <span className="text-gray-500 font-medium">Fetching Records...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : opportunities.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-gray-500 italic">
                                            No opportunities match your current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    opportunities.map((opt) => (
                                        <tr key={opt._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    {opt.title}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">NGO: {opt.ngo_id?.name || 'Private Donor'}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    {opt.location}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide
                                                    ${opt.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                      opt.status === 'in-progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {opt.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar size={14} />
                                                    {new Date(opt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    disabled={deletingId === opt._id}
                                                    onClick={() => handleDelete(opt._id, opt.title)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-all active:scale-95"
                                                >
                                                    {deletingId === opt._id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Trash2 size={16} /> Delete
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityModeration;
