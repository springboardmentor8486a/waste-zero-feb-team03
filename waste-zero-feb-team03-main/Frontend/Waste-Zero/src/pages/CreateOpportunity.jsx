import OpportunityForm from "../components/opportunity/OpportunityForm";
import { createOpportunity } from "../services/opportunityService";
import { useNavigate } from "react-router-dom";

const CreateOpportunity = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await createOpportunity(formData);
    alert("Opportunity Created Successfully");
    navigate("/dashboard/ngo");
  };

  return (
    <div>
      <h2>Create Opportunity</h2>
      <OpportunityForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateOpportunity;