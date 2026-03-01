import { useState, useEffect } from "react";

const OpportunityForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    duration: "",
    location: "",
    status: "open",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        required_skills: initialData.required_skills?.join(", "),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Title and Description required");
      return;
    }

    const formattedData = {
      ...form,
      required_skills: form.required_skills
        .split(",")
        .map((s) => s.trim()),
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        name="required_skills"
        value={form.required_skills}
        onChange={handleChange}
        placeholder="Skills (comma separated)"
      />

      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        placeholder="Duration"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="open">Open</option>
        <option value="closed">Closed</option>
        <option value="in-progress">
          In Progress
        </option>
      </select>

      <button type="submit" style={{ marginTop: "10px" }}>
        Submit
      </button>
    </form>
  );
};

export default OpportunityForm;