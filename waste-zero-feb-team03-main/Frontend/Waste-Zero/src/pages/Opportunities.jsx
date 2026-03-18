import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { getAllOpportunities, getMyOpportunities } from "../services/opportunityService";
import OpportunityCard from "../components/opportunity/OpportunityCard";
import DashboardLayout from "../components/DashboardLayout";
import { Search, Loader2, XCircle } from "lucide-react";
import api from "../services/api";
import { socket } from "../utils/socket";

const Opportunities = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appStatuses, setAppStatuses] = useState({});

  const isVolunteer = user?.role?.toLowerCase() === "volunteer";

  const fetchAppStatuses = useCallback(async () => {
    if (!isVolunteer) return;
    try {
      const res = await api.get("/applications/status");
      const statuses = res.data.reduce((acc, app) => {
        acc[app.opportunity._id] = app.status;
        return acc;
      }, {});
      setAppStatuses(statuses);
    } catch (err) {
      console.error("Error fetching application statuses:", err);
    }
  }, [isVolunteer]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const serviceCall = isVolunteer ? getAllOpportunities : getMyOpportunities;
      const res = await serviceCall();
      setData(res.data);
      if (isVolunteer) {
        await fetchAppStatuses();
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [isVolunteer, fetchAppStatuses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = data.filter((opp) =>
    search
      ? opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.description.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isVolunteer ? "Opportunities for You" : "Manage Opportunities"}
          </h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-600 dark:text-gray-400">
              {isVolunteer
                ? "Find and apply for tasks near you"
                : "View, edit, or delete your posted opportunities"}
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

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Fetching opportunities...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
            <Search className="text-gray-400 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {search ? `No results for "${search}"` : "No Opportunities Found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {search
                ? "Try a different search term."
                : isVolunteer
                  ? "There are no active tasks at the moment. Please check back later!"
                  : "You haven't posted any opportunities yet. Start by creating one."}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-4">
            {filtered.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onDelete={fetchData}
                applicationStatus={appStatuses[opp._id.toString()] ?? null}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Opportunities;
