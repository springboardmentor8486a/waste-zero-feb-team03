import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Globe, Clock, Briefcase, CheckCircle } from 'lucide-react';
import OpportunityForm from "../components/opportunity/OpportunityForm";
import { createOpportunity } from "../services/opportunityService";

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await createOpportunity(formData); // API integration: POST /opportunities
      navigate("/dashboard/ngo"); // Redirect to NGO dashboard
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-emerald-600/10 to-blue-600/5 dark:from-emerald-900/20 dark:to-transparent" />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Top Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all mb-8"
        >
          <div className="p-2 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="font-semibold text-sm tracking-wide uppercase">Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Create New <span className="text-emerald-600">Opportunity</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Post a volunteer opportunity for waste management and recycling to engage your community.
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Draft Mode</span>
          </div>
        </div>

        {/* Form Container with Glassmorphism */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left Info Panel (Visual Context) */}
            <div className="hidden lg:block bg-slate-50 dark:bg-slate-800/50 p-10 border-r border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Quick Tips</h3>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <Globe className="text-emerald-500 shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Specify the precise **Location** to attract nearby volunteers.</p>
                </li>
                <li className="flex gap-4">
                  <Briefcase className="text-blue-500 shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">List **Required Skills** clearly to ensure the right fit.</p>
                </li>
                <li className="flex gap-4">
                  <Clock className="text-amber-500 shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provide an accurate **Duration** for better scheduling.</p>
                </li>
              </ul>
              
              <div className="mt-20 p-6 bg-emerald-600 rounded-2xl text-white">
                <p className="text-xs font-bold uppercase mb-2 opacity-80">NGO Note</p>
                <p className="text-sm font-medium leading-relaxed">Your opportunity will be visible to all Volunteers in the Nagpur region.</p>
              </div>
            </div>

            {/* Right Form Side */}
            <div className="lg:col-span-2 p-8 md:p-12">
               <OpportunityForm onSubmit={handleCreate} isLoading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;
