import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Users, Trash2, Activity } from "lucide-react"; // ✅ Activity added
import OpportunityCard from "../../components/opportunity/OpportunityCard";

const NGODashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyOpportunities = useCallback(async () => {
    try {
      const res = await api.get("/opportunities/my");
      setOpportunities(res.data);
    } catch (err) {
      console.error("Error loading opportunities", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOpportunities();
  }, [fetchMyOpportunities]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await api.delete(`/opportunities/${id}`);
        setOpportunities(prev => prev.filter((opp) => opp._id !== id));
        alert("Opportunity deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error deleting opportunity.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">NGO Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/chat/messages")}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-bold flex items-center gap-2"
            >
              <MessageSquare size={20} className="text-emerald-600" /> Inbox
            </button>
            <button
              onClick={() => navigate("/create-opportunity")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all font-bold flex items-center gap-2"
            >
              <Plus size={20} /> Create New
            </button>
          </div>
        </div>

        {/* Milestone 3: Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Opportunities</p>
                <p className="text-2xl font-bold">{opportunities.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Posts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {opportunities.filter(o => o.status === 'open').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-colors" 
               onClick={() => navigate("/chat/messages")}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-2xl font-bold text-purple-600">Check Inbox</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities List Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Recent Postings</h2>
          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-500 text-lg">No opportunities created yet.</p>
                <button onClick={() => navigate("/create-opportunity")} className="text-emerald-600 font-bold mt-2 hover:underline">
                  Post your first one now →
                </button>
              </div>
            ) : ( 
              opportunities.map((opp) => (
                <div key={opp._id} className="relative group">
                  <OpportunityCard 
                    opportunity={opp} 
                    onDelete={handleDelete} 
                  />
                  {/* Link to see applicants for this specific post */}
                  <button 
                    onClick={() => navigate(`/opportunities/${opp._id}/applicants`)}
                    className="absolute top-4 right-16 bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm"
                  >
                    View Applicants
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;