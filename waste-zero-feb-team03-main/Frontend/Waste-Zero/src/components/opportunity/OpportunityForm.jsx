import React, { useState, useEffect } from 'react';
import { Loader2, Send } from 'lucide-react';

const OpportunityForm = ({ onSubmit, isLoading, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: [],
    duration: '',
    location: '',
    status: 'open'
  });

  // CRITICAL: Sync form state when initialData arrives from the API
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        required_skills: initialData.required_skills || [],
        duration: initialData.duration || '',
        location: initialData.location || '',
        status: initialData.status || 'open'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, required_skills: skills }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
        return alert("Please fill in all required fields.");
    }
    onSubmit(formData);
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all";
  const labelStyle = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelStyle}>Opportunity Title</label>
          <input name="title" className={inputStyle} value={formData.title} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Description</label>
          <textarea name="description" rows="4" className={inputStyle} value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label className={labelStyle}>Location</label>
          <input name="location" className={inputStyle} value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label className={labelStyle}>Duration</label>
          <input name="duration" className={inputStyle} value={formData.duration} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Required Skills (Comma separated)</label>
          <input name="required_skills" className={inputStyle} value={formData.required_skills.join(', ')} onChange={handleSkillChange} />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        {isLoading ? "Saving..." : "Update Opportunity"}
      </button>
    </form>
  );
};

export default OpportunityForm;