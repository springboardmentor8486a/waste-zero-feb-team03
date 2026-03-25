import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Search, ShieldAlert, CheckCircle2, UserX } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ role: "", status: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers(filters);
            setUsers(data.data);
        } catch (err) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            await adminService.updateUserStatus(id, newStatus);
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update user status");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 mt-1">View, filter, and moderate platform users</p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
                        <Search size={18} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Filter applied automatically</span>
                    </div>

                    <select
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    >
                        <option value="">All Roles</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {/* Error / Loading */}
                {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Name / Email</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Role</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Status</th>
                                    <th className="py-4 px-6 font-medium border-b border-gray-100 dark:border-gray-700">Joined</th>
                                    <th className="py-4 px-6 font-medium text-right border-b border-gray-100 dark:border-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">No users found.</td></tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition duration-150">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900 dark:text-white capitalize">{u.name}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                          ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        u.role === 'NGO' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize
                          ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {u.status === 'active' ? <CheckCircle2 size={14} /> : <UserX size={14} />}
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleStatusToggle(u._id, u.status)}
                                                    disabled={u.role === 'admin'}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                            ${u.role === 'admin' ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' :
                                                            u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' :
                                                                'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                                                >
                                                    <ShieldAlert size={16} />
                                                    {u.status === 'active' ? 'Suspend' : 'Activate'}
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

export default UserManagement;
