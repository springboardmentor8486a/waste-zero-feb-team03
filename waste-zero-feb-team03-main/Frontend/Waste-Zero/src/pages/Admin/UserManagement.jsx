import { useState, useEffect } from "react";
import adminService from "../../services/admin";
import Sidebar from "../../components/Sidebar";
import { Search, ShieldAlert, CheckCircle2, UserX, Loader2, Trash2, UserCheck } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filters, setFilters] = useState({ role: "", status: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUsers(filters);
            // Ensure we extract the array from the backend's { success, data } wrapper
            const userData = response.data?.data || response.data || [];
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

        try {
            await adminService.updateUserStatus(id, newStatus);
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${name}?`)) return;

        try {
            await adminService.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Error deleting user");
        }
    };

    const filtered = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#0f172a] text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-gray-400">Control platform access and permissions</p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative col-span-1 md:col-span-1">
                        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 outline-none"
                        onChange={(e) => setFilters({...filters, role: e.target.value})}
                    >
                        <option value="">All Roles</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="NGO">NGO</option>
                    </select>
                    <select 
                        className="bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 outline-none"
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {/* Table Container */}
                <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#111b2d] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role / Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr><td colSpan="3" className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></td></tr>
                            ) : filtered.map(u => (
                                <tr key={u._id} className="hover:bg-[#243347] transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold">{u.name}</div>
                                        <div className="text-xs text-gray-500">{u.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded uppercase">{u.role}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${u.status === 'active' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                                                {u.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            {/* Status Toggle Button */}
                                            <button 
                                                onClick={() => handleStatusToggle(u._id, u.status)}
                                                disabled={u.role?.toLowerCase() === 'admin'}
                                                className={`p-2 rounded-md transition-all ${u.status === 'active' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'} disabled:opacity-10`}
                                            >
                                                {u.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>

                                            {/* Hard Delete Button */}
                                            <button 
                                                onClick={() => handleDeleteUser(u._id, u.name)}
                                                disabled={u.role?.toLowerCase() === 'admin'}
                                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-all disabled:opacity-10"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;