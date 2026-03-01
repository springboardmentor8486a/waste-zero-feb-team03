import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpportunityForm from "../components/opportunities/OpportunityForm";
import {
  getOpportunityById,
  updateOpportunity,
} from "../services/opportunityService";

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getOpportunityById(id);
      setData(res.data);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    await updateOpportunity(id, formData);
    alert("Opportunity Updated Successfully");
    navigate("/dashboard");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Opportunity</h2>
      <OpportunityForm
        initialData={data}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditOpportunity;