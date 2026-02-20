import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";

const NGODashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOpportunities = async () => {
      try {
        const res = await api.get("/opportunities/my");
        setOpportunities(res.data);
      } catch (err) {
        console.error("Error loading opportunities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOpportunities();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">NGO Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your waste management opportunities and volunteer activities</p>
        </div>

        {/* Organization Profile Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Organization Profile</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organization Name</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contact Email</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user?.location || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Opportunities</p>
              <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{opportunities.filter(o => o.status === 'open').length}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold flex items-center gap-2">
            <span>+</span> Create New Opportunity
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-3 rounded-lg transition-all font-semibold">
            Manage Listings
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-3 rounded-lg transition-all font-semibold">
            View Analytics
          </button>
        </div>

        {/* Active Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Opportunities</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all your volunteer opportunities</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-3xl font-bold text-emerald-600">{opportunities.length}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No opportunities created yet</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Start by creating your first opportunity to engage volunteers</p>
              </div>
            ) : (
              opportunities.map((opp) => (
                <div key={opp._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{opp.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          📍 {opp.location}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ⏱️ {opp.duration}
                        </span>
                        {opp.required_skills?.length > 0 && (
                          <span className="text-gray-600 dark:text-gray-400">
                            🎯 {opp.required_skills.length} skills
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        opp.status === 'open' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : opp.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                      </span>
                      <button className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2 rounded transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
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
