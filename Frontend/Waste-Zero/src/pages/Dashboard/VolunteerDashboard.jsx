import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadOpen();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}! 🌟</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover and join meaningful volunteer opportunities in your area</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">0</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-6 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Impact Score</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">25 pts</p>
          </div>
        </div>

        {/* Skills & Bio */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Profile</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email</p>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Location</p>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.location || "Not set"}</p>
            </div>
            {user?.skills && user.skills.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Skills</p>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Available Opportunities</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Join a community making a real difference</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg">
              🔍 Advanced Search
            </button>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">No opportunities available right now</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Check back soon for new volunteer opportunities in your area</p>
              </div>
            ) : (
              opportunities.map((opp) => (
                <div key={opp._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{opp.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          opp.status === 'open' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{opp.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          📍 {opp.location}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          ⏱️ {opp.duration}
                        </span>
                      </div>
                      {opp.required_skills && opp.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {opp.required_skills.map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-md flex-shrink-0">
                      Apply Now
                    </button>
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

export default VolunteerDashboard;
