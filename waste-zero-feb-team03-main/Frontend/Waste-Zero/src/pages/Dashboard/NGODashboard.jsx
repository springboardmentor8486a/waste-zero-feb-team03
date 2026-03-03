import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import OpportunityCard from "../../components/opportunity/OpportunityCard";

const NGODashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Define Fetch Logic outside useEffect so it can be reused
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

  // 2. Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await api.delete(`/opportunities/${id}`);
        // UI update: remove the deleted item from state
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">NGO Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your waste management opportunities</p>
        </div>

        {/* Organization Profile Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Organization Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organization Name</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Opportunities</p>
              <p className="text-xl font-semibold text-emerald-600">
                {opportunities.filter(o => o.status === 'open').length}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/create-opportunity")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-md transition-all font-bold flex items-center gap-2"
        >
          <Plus size={20} /> Create New Opportunity
        </button>

        {/* Opportunities List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Opportunities</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-emerald-600">{opportunities.length}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-600">No opportunities created yet.</p>
              </div>
            ) : ( 
              opportunities.map((opp) => (
                <OpportunityCard 
                  key={opp._id} 
                  opportunity={opp} 
                  onDelete={handleDelete} // Changed from refresh to onDelete to match Card component
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;