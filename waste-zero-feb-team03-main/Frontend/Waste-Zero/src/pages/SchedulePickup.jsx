import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, MapPin, Package, Clock } from "lucide-react";

const SchedulePickup = () => {
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        location: "",
        items: "",
        notes: ""
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be an API call
        console.log("Scheduling pickup:", formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        setFormData({ date: "", time: "", location: "", items: "", notes: "" });
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule a Pickup</h1>
                        <p className="text-gray-500 mt-2">Arrange for our volunteers or NGO partners to collect your donations.</p>
                    </div>

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            <p className="font-medium">Your pickup has been scheduled successfully! We will match you shortly.</p>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Date</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Time</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock size={18} className="text-gray-400" />
                                            </div>
                                            <select
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                value={formData.time}
                                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                            >
                                                <option value="">Select a time slot</option>
                                                <option value="morning">Morning (8 AM - 12 PM)</option>
                                                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                                <option value="evening">Evening (4 PM - 8 PM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pickup Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter full address"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Donation Items</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <Package size={18} className="text-gray-400" />
                                        </div>
                                        <textarea
                                            placeholder="Describe the items (e.g., 50 boxed meals, gently used clothes)"
                                            rows="3"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                                            value={formData.items}
                                            onChange={e => setFormData({ ...formData, items: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-emerald-500/30"
                                    >
                                        Confirm Pickup Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePickup;
