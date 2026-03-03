import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

const OpportunityApplicants = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // Fetch only applicants for this specific opportunity ID
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
        <h2 className="text-3xl font-bold dark:text-white">Project Applicants</h2>
        
        {loading ? (
          <p>Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center border-2 border-dashed">
            <p className="text-gray-500">No volunteers have applied yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 font-semibold dark:text-white">Name</th>
                  <th className="p-4 font-semibold dark:text-white">Email</th>
                  <th className="p-4 font-semibold dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-t dark:border-gray-700">
                    <td className="p-4 dark:text-gray-200">{app.user?.name}</td>
                    <td className="p-4 dark:text-gray-200">{app.user?.email}</td>
                    <td className="p-4">
                      <span className="text-emerald-600 font-bold uppercase text-xs">
                        {app.status || "Pending"}
                      </span>
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