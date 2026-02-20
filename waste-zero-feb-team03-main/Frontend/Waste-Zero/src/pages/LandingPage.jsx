import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { ArrowRight, Users, Truck, Recycle, Bell, BarChart3, ShieldCheck, Globe, Leaf } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white selection:bg-emerald-500/30">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Animated Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-1.5 rounded-full mb-8 animate-fade-in shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Next-Gen Waste Management</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Join the <br />
                        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                            Recycling Revolution
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                        WasteZero connects volunteers, NGOs, and administrators to schedule pickups, manage recycling opportunities, and make a positive impact on our environment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/20"
                        >
                            <span>Schedule Your First Pickup</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#mission"
                            className="w-full sm:w-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 px-10 py-5 rounded-2xl font-bold text-lg transition-all"
                        >
                            How it Works
                        </a>
                    </div>
                </div>
            </section>

            {/* Core Outcomes / Mission Section */}
            <section id="mission" className="py-24 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">The WasteZero Advantage</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Harnessing technology for a responsible tomorrow.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Recycle,
                                title: "Smart Categorization",
                                desc: "Easily sort your waste into plastic, organic, e-waste, and more for optimal recycling."
                            },
                            {
                                icon: Truck,
                                title: "Dynamic Assignment",
                                desc: "Intelligent agent assignment based on your location for fast and efficient pickups."
                            },
                            {
                                icon: Bell,
                                title: "Real-time Notifications",
                                desc: "Stay updated with instant notifications when an agent is assigned and on their way."
                            },
                            {
                                icon: BarChart3,
                                title: "Waste Statistics",
                                desc: "Track your environmental impact with detailed statistics and responsible management data."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Secure Platform",
                                desc: "Role-based access control ensuring data security for Users, Agents, and Admins."
                            },
                            {
                                icon: Globe,
                                title: "Responsible Management",
                                desc: "Promoting sustainable habits through transparent and traceable waste management."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group">
                                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-16 border-t border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Recycle className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Waste Zero</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Promoting responsible waste management and smart recycling through digital innovation.
                    </p>
                    <div className="text-sm text-gray-400 dark:text-gray-600">
                        © 2026 WasteZero Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
