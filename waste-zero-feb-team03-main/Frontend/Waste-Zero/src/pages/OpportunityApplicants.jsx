import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { ArrowLeft, User, Mail, ExternalLink } from "lucide-react";

const OpportunityApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // Fetches applicants based on the specific Opportunity ID from the URL
        const res = await api.get(`/opportunities/${id}/applicants`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Navigation and Total Count Badge */}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-500">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-20 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-500 text-lg">No volunteers have applied for this task yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="p-4 font-semibold dark:text-white">Volunteer Name</th>
                  <th className="p-4 font-semibold dark:text-white">Email Address</th>
                  <th className="p-4 font-semibold dark:text-white text-center">Status</th>
                  <th className="p-4 font-semibold dark:text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <User size={16} />
                        </div>
                        {/* Correctly mapping flat data: app.name */}
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
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider">
                        Pending
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 ml-auto font-bold text-sm">
                        View Profile <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OpportunityApplicants;