import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllOpportunities } from "../../services/opportunityService";
import OpportunityCard from "../../components/opportunities/OpportunityCard";

const MyOpportunities = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await getAllOpportunities();
    const filtered = res.data.filter(
      (opp) => opp.ngo_id?._id === user.id
    );
    setData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>My Opportunities</h2>
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

export default MyOpportunities;