import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deleteOpportunity } from "../../services/opportunityService";

const OpportunityCard = ({ opportunity, refresh }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOwner =
    user?.role === "ngo" &&
    user?.id === opportunity?.ngo_id?._id;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );
    if (!confirmDelete) return;

    await deleteOpportunity(opportunity._id);
    refresh();
  };

  return (
    <div className="card">
      <h3>{opportunity.title}</h3>
      <p>{opportunity.description}</p>
      <p><strong>Location:</strong> {opportunity.location}</p>
      <p><strong>Status:</strong> {opportunity.status}</p>
      <p>
        <strong>Skills:</strong>{" "}
        {opportunity.required_skills?.join(", ")}
      </p>
      <p>
        <strong>NGO:</strong>{" "}
        {opportunity.ngo_id?.name}
      </p>

      {isOwner && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() =>
              navigate(`/opportunities/edit/${opportunity._id}`)
            }
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;