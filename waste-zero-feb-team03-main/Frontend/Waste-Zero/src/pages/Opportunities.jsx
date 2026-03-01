import { useEffect, useState } from "react";
import { getAllOpportunities } from "../services/opportunityService";
import OpportunityCard from "../components/opportunities/OpportunityCard";

const Opportunities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getAllOpportunities();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data.length)
    return <p>No opportunities available.</p>;

  return (
    <div>
      <h2>All Opportunities</h2>
      {data.map((opp) => (
        <OpportunityCard
          key={opp._id}
          opportunity={opp}
          refresh={fetchData}
        />
      ))}
    </div>
  );
};

export default Opportunities;