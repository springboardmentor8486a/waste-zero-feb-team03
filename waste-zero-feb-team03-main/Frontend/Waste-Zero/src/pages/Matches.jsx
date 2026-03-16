import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { Sparkles, MapPin, ArrowRight, Star, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, profileRes] = await Promise.all([
          api.get("/matches"),
          api.get("/users/me"),
        ]);

        setMatches(matchRes.data.matches || []);
        setVolunteerProfile(profileRes.data);
      } catch (err) {
        console.error("Match Error:", err);
        setError(err.response?.data?.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasSkills   = volunteerProfile?.skills?.length > 0;
  const hasLocation = !!volunteerProfile?.location;
  const profileIncomplete = !hasSkills || !hasLocation;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Matched Opportunities
          </h2>
        </div>

        {!loading && profileIncomplete && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 dark:text-amber-400 text-sm">
                Your profile is incomplete — matches may be limited
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-300 mt-1 space-y-0.5">
                {!hasSkills   && <li>• No skills added — skills are used to match you with opportunities</li>}
                {!hasLocation && <li>• No location set — location is used for nearby matches</li>}
              </ul>
              <button
                onClick={() => navigate("/profile")}
                className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-400 underline hover:no-underline"
              >
                Update your profile →
              </button>
            </div>
          </div>
        )}

        {!loading && volunteerProfile && (
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              {volunteerProfile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">
                Matching as: {volunteerProfile.name}
              </p>
              <div className="flex gap-4 mt-1 text-gray-500 dark:text-gray-400 text-xs">
                <span>
                  📍 {volunteerProfile.location || <span className="text-red-400">No location</span>}
                </span>
                <span>
                  🛠 {hasSkills
                    ? volunteerProfile.skills.join(", ")
                    : <span className="text-red-400">No skills</span>
                  }
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="text-xs text-emerald-600 font-semibold hover:underline shrink-0"
            >
              Edit Profile
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* No matches */}
        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Sparkles className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
              No matches found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
              {profileIncomplete
                ? "Add your skills and location to your profile so we can find matching opportunities."
                : "No open opportunities currently match your skills and location. Check back later!"}
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Update Profile
            </button>
          </div>
        )}

        {/* Match cards */}
        {!loading && !error && matches.length > 0 && (
          <div className="grid gap-4">
            {matches.map(({ opportunity, matchScore, skillScore, locationScore }) => (
              <div
                key={opportunity._id}
                className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {opportunity.title}
                      </h4>
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold">
                        <Star size={10} />
                        {(matchScore * 100).toFixed(0)}% match
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin size={14} /> {opportunity.location}
                    </p>

                    {/* Matched skills */}
                    {opportunity.required_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {opportunity.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Skill match: {(skillScore * 100).toFixed(0)}%</span>
                      <span>Location match: {(locationScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/chat/${opportunity.ngo_id?._id || opportunity.ngo_id}`)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
                  >
                    Message NGO <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Matches;
