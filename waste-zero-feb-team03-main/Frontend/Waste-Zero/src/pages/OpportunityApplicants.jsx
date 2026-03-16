import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { ArrowLeft, User, Mail, CheckCircle, XCircle, Clock } from "lucide-react";

const statusBadge = {
  pending:  { label: "Pending",  classes: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
  accepted: { label: "Accepted", classes: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
  rejected: { label: "Rejected", classes: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400" },
};

const OpportunityApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/opportunities/${id}/applicants`);
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  // Update application status (accept / reject)
  const handleStatusChange = async (volunteerId, newStatus) => {
    try {
      await api.put(`/opportunities/${id}/applicants/${volunteerId}/status`, {
        status: newStatus,
      });
      // Refresh the list to show updated status
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="dark:text-white" size={24} />
            </button>
            <h2 className="text-3xl font-bold dark:text-white">Project Applicants</h2>
          </div>
          <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
            {applicants.length} Total
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            <p className="mt-4 text-gray-500">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-20 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-500 text-lg">No volunteers have applied yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="p-4 font-semibold dark:text-white">Volunteer</th>
                  <th className="p-4 font-semibold dark:text-white">Email</th>
                  <th className="p-4 font-semibold dark:text-white text-center">Status</th>
                  <th className="p-4 font-semibold dark:text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => {
                  const badge = statusBadge[app.status] || statusBadge.pending;
                  return (
                    <tr
                      key={app._id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                            <User size={16} />
                          </div>
                          <span className="font-medium dark:text-gray-200">{app.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail size={14} />
                          {app.email}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {app.status !== "accepted" && (
                            <button
                              onClick={() => handleStatusChange(app._id, "accepted")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <CheckCircle size={14} /> Accept
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button
                              onClick={() => handleStatusChange(app._id, "rejected")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                          {app.status === "accepted" && (
                            <button
                              onClick={() => navigate(`/chat/${app._id}`)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Message
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OpportunityApplicants;
