import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">

      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">

        {/* Left */}
        <div className="p-10 bg-emerald-600 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Create Account</h1>
          <p className="text-sm">
            Become a part of the WasteZero sustainability network.
          </p>
        </div>

        {/* Right */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold mb-6">Register</h2>

          <div className="space-y-4">

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Full name"
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Email"
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Location"
            />

            <select className="w-full border rounded-lg px-4 py-2">
              <option>Volunteer</option>
              <option>NGO</option>
            </select>

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Password"
            />

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Confirm password"
            />

            <button
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
              Create Account
            </button>
          </div>

          <p className="text-sm mt-6">
            Already have an account?
            <Link to="/" className="text-emerald-600 ml-1">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
