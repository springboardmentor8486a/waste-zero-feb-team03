import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Search, MapPin, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const OpportunityModeration = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: "", location: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOpportunities();
    }, [filters]);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const data = await adminService.getOpportunities(filters);
            setOpportunities(data.data);
        } catch (err) {
            setError("Failed to fetch opportunities");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete opportunity: "${title}"? This action cannot be undone.`)) return;

        try {
            await adminService.deleteOpportunity(id);
            setOpportunities(opportunities.filter(o => o._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete opportunity");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Opportunity Moderation</h1>
                    <p className="text-gray-500 mt-1">Review and manage food donation and volunteering events</p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
                        <MapPin size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by location..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-200"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Title & NGO</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Location</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Status</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Posted On</th>
                                    <th className="py-4 px-6 font-medium text-right border-b border-gray-100 dark:border-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading opportunities...</td></tr>
                                ) : opportunities.length === 0 ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">No opportunities found.</td></tr>
                                ) : (
                                    opportunities.map((opt) => (
                                        <tr key={opt._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition duration-150">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{opt.title}</div>
                                                <div className="text-sm text-gray-500">{opt.ngo_id?.name || 'Unknown NGO'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                                                {opt.location}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                          ${opt.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        opt.status === 'in-progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    {opt.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(opt.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleDelete(opt._id, opt.title)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <Trash2 size={16} /> Delete
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
