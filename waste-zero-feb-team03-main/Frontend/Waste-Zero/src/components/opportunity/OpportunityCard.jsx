import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Clock, Edit, Trash2, Users, Send } from "lucide-react";
import api from "../../services/api";

const OpportunityCard = ({ opportunity, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Flexible check to handle string vs object IDs and _id vs id naming
  const isOwner = user?.role === "ngo" && (
    user?.id === (opportunity?.ngo_id?._id || opportunity?.ngo_id) ||
    user?._id === (opportunity?.ngo_id?._id || opportunity?.ngo_id)
  );

  const handleApply = async () => {
    try {
      await api.post(`/opportunities/${opportunity._id}/apply`);
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying for opportunity");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              {opportunity.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              opportunity.status === 'open' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {opportunity.status || 'open'}
            </span>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 max-w-2xl">
            {opportunity.description}
          </p>

          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-600" /> {opportunity.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-600" /> {opportunity.duration}
            </span>
          </div>

          {/* Display Skills/Tags if they exist */}
          {opportunity.required_skills && (
            <div className="flex gap-2 mt-4">
              {opportunity.required_skills.map((skill, index) => (
                <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-2">
          {/* NGO ACTIONS: Only visible to the owner */}
          {isOwner && (
            <>
              <button 
                onClick={() => navigate(`/opportunities/${opportunity._id}/applicants`)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
                title="View Applicants"
              >
                <Users size={18} /> Applicants
              </button>
              <button 
                onClick={() => navigate(`/opportunities/edit/${opportunity._id}`)}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <Edit size={18} /> Edit
              </button>
              <button 
                onClick={() => onDelete(opportunity._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <Trash2 size={18} /> Delete
              </button>
            </>
          )}

          {/* VOLUNTEER ACTION: Fixed duplicate button */}
          {user?.role === "volunteer" && (
            <button 
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
            >
              <Send size={18} /> Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;