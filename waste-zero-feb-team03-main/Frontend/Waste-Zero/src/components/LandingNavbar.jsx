import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Recycle, LogIn } from "lucide-react";

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg border-b border-white/20"
                : "py-6 bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-emerald-600 rounded-lg group-hover:bg-emerald-700 transition-all">
                            <Recycle className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Waste Zero</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#mission" className="font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            Features
                        </a>
                        <Link
                            to="/login"
                            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all hover:shadow-emerald-500/25 hover:shadow-lg active:scale-95"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="px-4 py-6 space-y-4">
                    <a
                        href="#mission"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg font-medium text-gray-600 dark:text-gray-300"
                    >
                        Features
                    </a>
                    <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 bg-emerald-600 text-white p-3 rounded-xl font-bold"
                    >
                        <LogIn className="w-5 h-5" />
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;
