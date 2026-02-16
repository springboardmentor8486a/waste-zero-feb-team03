//Faiza shaikh

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:5000/auth/login", form);

//       login(res.data);

//       if (res.data.user.role === "Volunteer") {
//         navigate("/dashboard/volunteer");
//       } else {
//         navigate("/dashboard/ngo");
//       }
//     } catch (err) {
//       alert("Login Failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="left">
//         <h1>WasteZero</h1>
//         <h2>Join the Recycling Revolution</h2>
//       </div>

//       <div className="right">
//         <form onSubmit={handleSubmit}>
//           <h3>Login</h3>
//           <input
//             type="email"
//             placeholder="Email"
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) =>
//               setForm({ ...form, password: e.target.value })
//             }
//           />
//           <button type="submit">Login</button>
          
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { Link } from "react-router-dom";

import "./login.css";
import "./Register"

const Login = () => {
  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="left-section">
        <h2 className="logo">♻ WasteZero</h2>
        <h1>Join the Recycling Revolution</h1>
        <p>
          WasteZero connects volunteers, NGOs, and administrators to schedule
          pickups, manage recycling opportunities, and make a positive impact
          on our environment.
        </p>

        <div className="features">
          <div>
            <h4>Schedule Pickups</h4>
            <p>Easily arrange waste collection</p>
          </div>
          <div>
            <h4>Track Impact</h4>
            <p>Monitor your environmental contribution</p>
          </div>
          <div>
            <h4>Volunteer</h4>
            <p>Join recycling initiatives</p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <div className="auth-box">
          <div className="tabs">
            <button className="active">Login</button>
            <div className="tabs">
  <button className="active">Login</button>
  <Link to="/register">
    <button>Register</button>
  </Link>
</div>

          </div>

          <h2>Login to your account</h2>
          <p className="subtitle">
            Enter your credentials to access your account
          </p>

          <form>
            <label>Username</label>
            <input type="text" placeholder="Your username" />

            <label>Password</label>
            <input type="password" placeholder="Your password" />

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
