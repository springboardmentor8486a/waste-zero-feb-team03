import { useEffect, useState } from "react";
// Import useAuth to access the user's role
import { useAuth } from "../context/AuthContext"; 
import { getAllOpportunities } from "../services/opportunityService"; 
import OpportunityCard from "../components/opportunity/OpportunityCard";
import DashboardLayout from "../components/DashboardLayout";

const Opportunities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Destructure the user from your AuthContext
  const { user } = useAuth(); 

  const fetchData = async () => {
    try {
      const res = await getAllOpportunities();
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Determine if the user is a volunteer
  const isVolunteer = user?.role?.toLowerCase() === "volunteer";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          {/* Conditional Heading */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isVolunteer ? "Opportunities for You" : "All Opportunities listed by you"}
          </h2>
          
          {/* Conditional Subheading */}
          <p className="text-gray-600 dark:text-gray-400">
            {isVolunteer ? "Find and apply for new tasks near you" : "Manage the Opportunities"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : !data.length ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-600">No opportunities available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onDelete={fetchData} 
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Opportunities;