import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Loader2, AlertCircle } from 'lucide-react';
import OpportunityForm from "../components/opportunity/OpportunityForm";
import { getOpportunityById, updateOpportunity } from "../services/opportunityService";

const EditOpportunity = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Step 1: Fetching data for ID:", id);
      try {
        const res = await getOpportunityById(id);
        console.log("Step 2: API Response Received:", res);
        
        const result = res.data || res;
        
        if (!result || Object.keys(result).length === 0) {
          throw new Error("No data found for this opportunity");
        }

        setData(result);
        console.log("Step 3: State 'data' has been set!");
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch opportunity data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateOpportunity(id, formData);
      alert("Opportunity Updated Successfully"); 
      navigate("/dashboard/ngo"); // Redirect to dashboard
    } catch (err) {
      alert("Update failed. Please check your connection.");
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#020617]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Opportunity Data...</p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617] p-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 3. Success State (The Actual Page)
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600/5 to-emerald-600/10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 font-semibold"
        >
          <ArrowLeft size={18} />
          <span>BACK TO DASHBOARD</span>
        </button>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Edit <span className="text-emerald-600">Opportunity</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Updating: <span className="text-slate-900 dark:text-slate-200">{data?.title}</span>
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Added buttonText prop here */}
            <OpportunityForm 
              initialData={data} 
              onSubmit={handleUpdate} 
              isLoading={false} 
              buttonText="Update Opportunity" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunity;