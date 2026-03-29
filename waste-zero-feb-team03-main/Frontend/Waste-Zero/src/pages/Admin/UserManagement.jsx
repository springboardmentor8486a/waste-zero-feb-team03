import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Search, Loader2, UserX, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ role: "", status: "" });
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getUsers(filters);
            const userData = response.data?.data || [];
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            setError("Could not load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        if (!window.confirm(`Switch user to ${newStatus}?`)) return;

        setUpdatingId(id);
        try {
            await adminService.updateUserStatus(id, newStatus);
            setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
            toast.success(`User ${newStatus === "suspended" ? "suspended" : "activated"} successfully.`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-gray-500 dark:text-gray-400">Control platform access and permissions</p>
                    </div>
                    <span className="text-sm text-gray-400">
                        {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    >
                        <option value="">All Roles</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="NGO">NGO</option>
                    </select>
                    <select
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">User</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">Role / Status</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700">Location</th>
                                <th className="p-4 font-semibold border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center">
                                        <Loader2 className="animate-spin mx-auto text-emerald-500" size={28} />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-gray-400 dark:text-gray-500 italic">
                                        No users match your filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">

                                        {/* User */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role / Status */}
                                        <td className="p-4">
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded uppercase font-bold">
                                                    {u.role}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                                                    u.status === 'suspended'
                                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                }`}>
                                                    {u.status || 'active'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                            {u.location || <span className="italic text-gray-400 dark:text-gray-600">—</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleStatusToggle(u._id, u.status || 'active')}
                                                disabled={updatingId === u._id}
                                                title={u.status === 'suspended' ? 'Activate user' : 'Suspend user'}
                                                className={`p-2 rounded-md transition-all disabled:opacity-40 ${
                                                    u.status === 'suspended'
                                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                                                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
                                                }`}
                                            >
                                                {updatingId === u._id
                                                    ? <Loader2 size={18} className="animate-spin" />
                                                    : u.status === 'suspended'
                                                        ? <UserCheck size={18} />
                                                        : <UserX size={18} />
                                                }
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
    );
};

export default UserManagement;