import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/loginpage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VolunteerDashboard from "./pages/Dashboard/VolunteerDashboard";
import NGODashboard from "./pages/Dashboard/NGODashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerDashboard />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
