import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { Sparkles, MessageCircle } from "lucide-react"; // 2. Import icons
import api from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import OpportunityCard from "../../components/opportunity/OpportunityCard";

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 3. Initialize navigate
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOpen = async () => {
    try {
      const res = await api.get("/opportunities");
      setOpportunities(res.data);
    } catch (err) {
      console.error("Failed to load opportunities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpen();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}! 🌟</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Discover and join meaningful volunteer opportunities in your area</p>
          </div>

          {/* --- MILESTONE 3: NAVIGATION BUTTONS --- */}
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/matches")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200"
            >
              <Sparkles size={18} />
              View Matches
            </button>
            <button 
              onClick={() => navigate("/chat/messages")} // General messages view
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition-all"
            >
              <MessageCircle size={18} />
              Chats
            </button>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 p-6 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Impact Score</p>
            <p className="text-3xl font-bold text-emerald-600">25 pts</p>
          </div>
          {/* ... other stats ... */}
        </div>

        {/* Opportunities Feed */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Available Opportunities</h2>
          
          <div className="grid gap-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : opportunities.length === 0 ? (
              <p className="text-center py-12 text-gray-500">No opportunities available right now.</p>
            ) : (
              opportunities.map((opp) => (
                <OpportunityCard 
                  key={opp._id} 
                  opportunity={opp} 
                  onDelete={loadOpen} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VolunteerDashboard;