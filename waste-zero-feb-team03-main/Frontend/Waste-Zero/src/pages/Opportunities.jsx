import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { getAllOpportunities } from "../services/opportunityService";
import OpportunityCard from "../components/opportunity/OpportunityCard";
import DashboardLayout from "../components/DashboardLayout";
import { Search, Loader2 } from "lucide-react";
import api from "../services/api";
import { socket } from "../utils/socket";

const Opportunities = () => {
  const { user } = useAuth();
  const [searchParams]  = useSearchParams();
  const [data,          setData]         = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [appStatuses,   setAppStatuses]  = useState({});

  const urlQuery    = searchParams.get("q") || "";
  const isVolunteer = user?.role?.toLowerCase() === "volunteer";

  const fetchAppStatuses = useCallback(async () => {
    if (!isVolunteer) return;
    try {
      const res = await api.get("/applications/my");
      const map = {};
      res.data.forEach((app) => {
        map[app.opportunity_id.toString()] = app.status;
      });
      setAppStatuses(map);
    } catch (err) {
      console.error("Failed to fetch app statuses:", err);
    }
  }, [isVolunteer]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllOpportunities();
      setData(res.data);
      await fetchAppStatuses();
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAppStatuses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isVolunteer) return;

    const handleAccepted = () => {
      fetchAppStatuses();
    };

    const handleNotification = (notification) => {
      if (notification.type === "applicationUpdate") {
        fetchAppStatuses();
      }
    };

    socket.on("applicationAccepted", handleAccepted);
    socket.on("notification",        handleNotification);

    return () => {
      socket.off("applicationAccepted", handleAccepted);
      socket.off("notification",        handleNotification);
    };
  }, [isVolunteer, fetchAppStatuses]);

  const filtered = urlQuery
    ? data.filter((opp) => {
        const q = urlQuery.toLowerCase();
        return (
          opp.title?.toLowerCase().includes(q)       ||
          opp.description?.toLowerCase().includes(q) ||
          opp.location?.toLowerCase().includes(q)    ||
          opp.required_skills?.some((s) => s.toLowerCase().includes(q))
        );
      })
    : data;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isVolunteer ? "Opportunities for You" : "Manage Opportunities"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isVolunteer
              ? "Find and apply for tasks near you"
              : "View, edit, or delete your posted opportunities"}
          </p>
        </div>

        {urlQuery && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Search size={14} />
            Results for{" "}
            <span className="font-semibold text-gray-900 dark:text-white">"{urlQuery}"</span>
            <span className="text-gray-400">
              — {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

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
              {urlQuery ? `No results for "${urlQuery}"` : "No Opportunities Found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {urlQuery
                ? "Try a different search term."
                : isVolunteer
                  ? "No active tasks right now."
                  : "No opportunities posted yet."}
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
