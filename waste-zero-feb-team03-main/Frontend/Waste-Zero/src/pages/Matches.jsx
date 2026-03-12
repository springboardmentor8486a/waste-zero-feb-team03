import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/matches"); // API integration
        setMatches(res.data);
      } catch (err) {
        console.error("Match Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Matched for You</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Finding best matches...</p>
        ) : !matches.length ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No skill matches found. Try updating your profile!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((opp) => (
              <div key={opp._id} className="p-5 bg-emerald-50/30 border border-emerald-100 rounded-xl flex justify-between items-center transition-hover hover:shadow-md">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{opp.title}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin size={14} /> {opp.location}</p>
                  <div className="flex flex-wrap gap-2">
                    {opp.matchingSkills?.map(skill => (
                      <span key={skill} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/chat/${opp.ngo_id}`)}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Message NGO <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Matches;