import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Page Imports
import LandingPage from "./pages/LandingPage";
import Login from "./pages/loginpage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Opportunities from "./pages/Opportunities"; // New discovery page
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import VolunteerDashboard from "./pages/Dashboard/VolunteerDashboard";
import NGODashboard from "./pages/Dashboard/NGODashboard";

// Component Imports
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Discovery Route (Accessible by both roles) */}
            <Route path="/opportunities" element={<Opportunities />} />

            {/* Common Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Volunteer Specific Routes */}
            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute role="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />

            {/* NGO Specific Routes */}
            <Route
              path="/dashboard/ngo"
              element={
                <ProtectedRoute role="ngo">
                  <NGODashboard />
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
