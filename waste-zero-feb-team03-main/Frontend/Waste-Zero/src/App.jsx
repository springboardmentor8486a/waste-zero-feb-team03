import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { socket, connectSocket, disconnectSocket } from "./utils/socket";

// Layout
import Navbar1 from "./components/layout/Navbar1";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/loginpage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword"; // ← NEW
import SchedulePickup from "./pages/SchedulePickup";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Impact from "./pages/Impact";
import Opportunities from "./pages/Opportunities";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import VolunteerDashboard from "./pages/Dashboard/VolunteerDashboard";
import NGODashboard from "./pages/Dashboard/NGODashboard";
import OpportunityApplicants from "./pages/OpportunityApplicants";
import NGOMatches from "./pages/NGOMatches";

// Milestone 3
import Matches from "./pages/Matches";
import ChatRoom from "./pages/ChatRoom";
import MessageInbox from "./pages/MessageInbox";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import OpportunityModeration from "./pages/Admin/OpportunityModeration";
import AdminReports from "./pages/Admin/AdminReports";

const SocketManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect only after user is logged in 
      connectSocket();

      socket.on("connect", () => {
        console.log("%c🚀 WebSocket Connected!", "color: #10b981; font-weight: bold;");
      });

      socket.on("connect_error", (err) => {
        console.error("❌ WebSocket Error:", err.message);
      });
    } else {
      // Disconnect when user logs out
      disconnectSocket();
    }

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar1 />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Shared protected */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><SchedulePickup /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="/impact" element={<ProtectedRoute><Impact /></ProtectedRoute>} />

        <Route path="/chat/messages" element={<ProtectedRoute><MessageInbox /></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />

        {/* Volunteer */}
        <Route path="/dashboard/volunteer" element={<ProtectedRoute role="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute role="volunteer"><Matches /></ProtectedRoute>} />

        {/* NGO */}
        <Route path="/dashboard/ngo" element={<ProtectedRoute role="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path="/opportunities/:id/applicants" element={<ProtectedRoute role="ngo"><OpportunityApplicants /></ProtectedRoute>} />
        <Route path="/create-opportunity" element={<ProtectedRoute role="ngo"><CreateOpportunity /></ProtectedRoute>} />
        <Route path="/opportunities/edit/:id" element={<ProtectedRoute role="ngo"><EditOpportunity /></ProtectedRoute>} />
        <Route path="/ngo/matches" element={<ProtectedRoute role="ngo"><NGOMatches /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/opportunities" element={<ProtectedRoute role="admin"><OpportunityModeration /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SocketManager />
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
