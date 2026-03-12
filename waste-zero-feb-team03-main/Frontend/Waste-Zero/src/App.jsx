import { useEffect } from "react"; // 1. Added useEffect
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { socket } from "./utils/socket"; // 2. Imported your socket utility

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

// Component Imports
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  // --- START WEBSOCKET TEST CODE ---
  useEffect(() => {
    // Attempt to connect
    socket.connect();

    socket.on("connect", () => {
      console.log("%c🚀 WebSocket Connected Successfully!", "color: #10b981; font-weight: bold; font-size: 14px;");
      console.log("📡 Your Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("%c❌ WebSocket Connection Error:", "color: #ef4444; font-weight: bold;");
      console.error(err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);
  // --- END WEBSOCKET TEST CODE ---

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/opportunities" element={<Opportunities />} />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/chat/:userId" 
              element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute role="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/matches"
              element={
                <ProtectedRoute role="volunteer">
                  <Matches />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/ngo"
              element={
                <ProtectedRoute role="ngo">
                  <NGODashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/opportunities/:id/applicants"
              element={
                <ProtectedRoute role="ngo">
                  <OpportunityApplicants />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-opportunity"
              element={
                <ProtectedRoute role="ngo">
                  <CreateOpportunity />
                </ProtectedRoute>
              }
            />

            <Route
              path="/opportunities/edit/:id"
              element={
                <ProtectedRoute role="ngo">
                  <EditOpportunity />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;