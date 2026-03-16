import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Users, MapPin, Star, MessageSquare,
  ChevronDown, ChevronUp, Loader2, Sparkles
} from "lucide-react";

const NGOMatches = () => {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(true);

  const [matchData, setMatchData] = useState({});

  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await api.get("/opportunities/my");
        setOpportunities(res.data || []);

        if (res.data?.length > 0) {
          const firstId = res.data[0]._id;
          setExpanded({ [firstId]: true });
          fetchMatchesFor(firstId);
        }
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoadingOpps(false);
      }
    };
    fetchOpps();
  }, []);

  const fetchMatchesFor = async (oppId) => {
    if (matchData[oppId]?.matches) return;

    setMatchData((prev) => ({ ...prev, [oppId]: { loading: true, matches: [] } }));

    try {
      const res = await api.get(`/matches/${oppId}`);
      setMatchData((prev) => ({
        ...prev,
        [oppId]: { loading: false, matches: res.data.matches || [] },
      }));
    } catch (err) {
      console.error(`Failed to load matches for ${oppId}:`, err);
      setMatchData((prev) => ({
        ...prev,
        [oppId]: { loading: false, matches: [] },
      }));
    }
  };

  const toggleExpand = (oppId) => {
    const willExpand = !expanded[oppId];
    setExpanded((prev) => ({ ...prev, [oppId]: willExpand }));
    if (willExpand) fetchMatchesFor(oppId);
  };

  const ScoreBar = ({ label, value, color }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${(value * 100).toFixed(0)}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-600 dark:text-gray-400 font-medium">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Sparkles className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Volunteer Matches
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top matched volunteers for each of your opportunities
            </p>
          </div>
        </div>

        {loadingOpps ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Users className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No opportunities posted yet.</p>
            <button
              onClick={() => navigate("/create-opportunity")}
              className="mt-3 text-emerald-600 font-semibold hover:underline text-sm"
            >
              Create your first opportunity →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => {
              const isOpen   = expanded[opp._id];
              const data     = matchData[opp._id];
              const matches  = data?.matches || [];
              const loading  = data?.loading;

              return (
                <div
                  key={opp._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleExpand(opp._id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <Users className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={12} /> {opp.location}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            opp.status === "open"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {opp.status}
                          </span>
                          {data && !loading && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-0.5 rounded-full">
                              {matches.length} match{matches.length !== 1 ? "es" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp size={18} className="text-gray-400 shrink-0" />
                      : <ChevronDown size={18} className="text-gray-400 shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-700 p-5">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="animate-spin text-emerald-600" size={24} />
                        </div>
                      ) : matches.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No matching volunteers found for this opportunity yet.
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {matches.map(({ volunteer, matchScore, skillScore, locationScore }) => (
                            <div
                              key={volunteer._id}
                              className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                                  {volunteer.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                    {volunteer.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {volunteer.email}
                                  </p>
                                </div>
                                <span className="ml-auto flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                                  <Star size={10} />
                                  {(matchScore * 100).toFixed(0)}%
                                </span>
                              </div>

                              {volunteer.location && (
                                <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                  <MapPin size={12} /> {volunteer.location}
                                </p>
                              )}

                              {volunteer.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {volunteer.skills.slice(0, 4).map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-[10px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {volunteer.skills.length > 4 && (
                                    <span className="text-[10px] text-gray-400">
                                      +{volunteer.skills.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="space-y-1.5 mb-4">
                                <ScoreBar label="Skills"    value={skillScore}    color="bg-emerald-500" />
                                <ScoreBar label="Location"  value={locationScore} color="bg-blue-500" />
                              </div>

                              <button
                                onClick={() => navigate(`/chat/${volunteer._id}`)}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                              >
                                <MessageSquare size={14} />
                                Message Volunteer
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NGOMatches;
