import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ChevronDown, MessageSquare, PhoneCall, Mail } from "lucide-react";

const faqs = [
    { question: "How do I edit my submitted opportunity?", answer: "You can navigate to the 'Opportunities' tab from your dashboard, find your posted opportunity, and click the 'Edit' button to update details." },
    { question: "I missed a scheduled pickup. What happens now?", answer: "Don't worry. You can reschedule the pickup from the 'Schedule Pickup' page. Please try to notify the matched volunteer or NGO in the chats if you anticipate being unavailable." },
    { question: "How are volunteers matched to my donation?", answer: "Our algorithm matches volunteers based on your location and the skills they have registered on their profile. Volunteers can also browse opportunities to manually apply to yours." },
    { question: "Is my personal data secure?", answer: "Yes! WasteZero uses industry standard encryption and JWT for session management. We do not sell your data." },
];

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-12 py-8 bg-emerald-600 rounded-3xl shadow-md text-white px-4">
                        <h1 className="text-4xl font-bold mb-4">How can we help you today?</h1>
                        <p className="text-emerald-100 max-w-xl mx-auto">Search our knowledge base or get in touch with our dedicated support team to resolve your issues quickly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-500 mx-auto flex items-center justify-center mb-4">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                            <p className="text-sm text-gray-500 mb-4">Talk directly to our support agents</p>
                            <button className="text-blue-600 font-medium text-sm hover:underline">Start a Conversation</button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-500 mx-auto flex items-center justify-center mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
                            <p className="text-sm text-gray-500 mb-4">Send us an email anytime</p>
                            <button className="text-emerald-600 font-medium text-sm hover:underline">support@wastezero.com</button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-500 mx-auto flex items-center justify-center mb-4">
                                <PhoneCall size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Phone Call</h3>
                            <p className="text-sm text-gray-500 mb-4">Available Mon-Fri, 9AM-5PM</p>
                            <button className="text-purple-600 font-medium text-sm hover:underline">1-800-WASTE-0</button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left font-medium text-gray-900 dark:text-white transition-colors"
                                    >
                                        {faq.question}
                                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Support;
