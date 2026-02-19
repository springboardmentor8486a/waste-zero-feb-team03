import { useAuth } from "../../context/AuthContext";

const VolunteerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>

      <div className="mt-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 mt-6">
        Available Opportunities
      </button>

      <div className="mt-6">
        <h2 className="text-xl">My Applications</h2>
        <p className="text-gray-500">No applications yet.</p>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
