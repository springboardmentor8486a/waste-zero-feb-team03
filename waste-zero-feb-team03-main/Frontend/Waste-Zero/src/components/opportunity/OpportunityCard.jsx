import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Clock, Edit, Trash2, Users, Send, CheckCircle, Lock } from "lucide-react"; 
import api from "../../services/api";

const OpportunityCard = ({ opportunity, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Normalize status to lowercase to avoid matching errors
  const status = opportunity.status?.toLowerCase() || 'open';
  const isClosed = status === 'closed';

  // NGO Ownership check: Verify if the current user is the creator
  const isOwner = user?.role === "ngo" && (
    user?.id === (opportunity?.ngo_id?._id || opportunity?.ngo_id) ||
    user?._id === (opportunity?.ngo_id?._id || opportunity?.ngo_id)
  );

  // Check if current volunteer has already applied
  const hasApplied = opportunity.applicants?.some(applicantId => {
    const idToCheck = applicantId._id || applicantId; 
    return idToCheck === (user?.id || user?._id);
  });

  // NEW: Confirmation Modal Logic (Requirement #4)
  const handleDeleteClick = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${opportunity.title}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      onDelete(opportunity._id);
    }
  };

  const handleApply = async () => {
    if (isClosed) return; // Block application if closed
    try {
      await api.post(`/opportunities/${opportunity._id}/apply`);
      alert("Application submitted successfully!");
      window.location.reload(); 
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
            {/* Dynamic Status Badge */}
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              status === 'open' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {status}
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
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button 
                onClick={() => navigate(`/opportunities/${opportunity._id}/applicants`)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <Users size={18} /> Applicants
              </button>
              <button 
                onClick={() => navigate(`/opportunities/edit/${opportunity._id}`)}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <Edit size={18} /> Edit
              </button>
              {/* Updated Delete Button with Confirmation Modal */}
              <button 
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
              >
                <Trash2 size={18} /> Delete
              </button>
            </>
          )}

          {/* VOLUNTEER ACTION: Smart Button Logic */}
          {user?.role === "volunteer" && (
            <button 
              onClick={handleApply}
              disabled={hasApplied || isClosed}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all ${
                (hasApplied || isClosed)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-700" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {hasApplied ? (
                <><CheckCircle size={18} /> Applied</>
              ) : isClosed ? (
                <><Lock size={18} /> Closed</>
              ) : (
                <><Send size={18} /> Apply Now</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;