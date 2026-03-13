import { useEffect } from "react";
// 1. Added useLocation to the import
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { socket } from "./utils/socket"; 

// Component Imports
import Navbar1 from "./components/layout/Navbar1"; 
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Page Imports
import LandingPage from "./pages/LandingPage";
import Login from "./pages/loginpage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Opportunities from "./pages/Opportunities"; 
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import VolunteerDashboard from "./pages/Dashboard/VolunteerDashboard";
import NGODashboard from "./pages/Dashboard/NGODashboard";
import OpportunityApplicants from "./pages/OpportunityApplicants"; 

// Milestone 3 Imports
import Matches from "./pages/Matches";
import ChatRoom from "./pages/ChatRoom";

// 2. Created this wrapper to handle conditional rendering
const AppContent = () => {
  const location = useLocation();
  
  // List of paths where you want to HIDE Navbar1 (because you have a hardcoded one)
  const hideNavbarPaths = ["/", "/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* Navbar1 only shows on internal/protected pages */}
      {shouldShowNavbar && <Navbar1 />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities />} />

        {/* Shared Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />

        {/* Volunteer Routes */}
        <Route path="/dashboard/volunteer" element={<ProtectedRoute role="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute role="volunteer"><Matches /></ProtectedRoute>} />

        {/* NGO Routes */}
        <Route path="/dashboard/ngo" element={<ProtectedRoute role="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path="/opportunities/:id/applicants" element={<ProtectedRoute role="ngo"><OpportunityApplicants /></ProtectedRoute>} />
        <Route path="/create-opportunity" element={<ProtectedRoute role="ngo"><CreateOpportunity /></ProtectedRoute>} />
        <Route path="/opportunities/edit/:id" element={<ProtectedRoute role="ngo"><EditOpportunity /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  // --- START WEBSOCKET LOGIC ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("%c🚀 WebSocket Connected Successfully!", "color: #10b981; font-weight: bold; font-size: 14px;");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket Connection Error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);
  // --- END WEBSOCKET LOGIC ---

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;