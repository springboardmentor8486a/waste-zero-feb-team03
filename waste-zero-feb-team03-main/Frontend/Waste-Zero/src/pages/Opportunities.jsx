import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { getAllOpportunities, getMyOpportunities } from "../services/opportunityService";
import OpportunityCard from "../components/opportunity/OpportunityCard";
import DashboardLayout from "../components/DashboardLayout";
import { Search, Loader2, XCircle } from "lucide-react"; // Import icons for better UI

const Opportunities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const isVolunteer = user?.role?.toLowerCase() === "volunteer";

  const fetchData = async () => {
    try {
      setLoading(true); // Ensure loading state triggers on refresh
      const fetchFunction = isVolunteer ? getAllOpportunities : getMyOpportunities;
      const res = await fetchFunction(search ? { search } : {});
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [search, user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          {/* Conditional Heading for Role-based Dashboards */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isVolunteer ? "Opportunities for You" : "Manage Opportunities"}
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              {isVolunteer
                ? "Find and apply for new tasks near you"
                : "View, edit, or delete the opportunities you have posted"}
            </p>
            {search && (
              <Link
                to="/opportunities"
                className="flex items-center gap-1.5 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition-colors"
                title="Clear Search"
              >
                <span>Search: <strong>"{search}"</strong></span>
                <XCircle size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Improved Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Fetching opportunities...</p>
          </div>
        ) : !data.length ? (
          /* Enhanced Empty State UI */
          <div className="bg-white dark:bg-gray-800 p-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full mb-4">
              <Search className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              No Opportunities Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {isVolunteer
                ? "There are no active tasks at the moment. Please check back later!"
                : "You haven't posted any opportunities yet. Start by creating one."}
            </p>
          </div>
        ) : (
          /* Grid Layout for Opportunity Cards */
          <div className="grid gap-4">
            {data.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onDelete={fetchData} // Refresh list after successful delete
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Opportunities;