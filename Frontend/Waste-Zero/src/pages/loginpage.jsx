import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">

      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">

        {/* Left section */}
        <div className="p-10 bg-emerald-600 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">WasteZero</h1>
          <p className="text-sm leading-relaxed">
            Join the recycling revolution. Manage waste, track impact
            and support sustainability.
          </p>
        </div>

        {/* Right section */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold mb-6">Login</h2>

          <div className="space-y-4">
            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Email"
            />

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Password"
            />

            <button
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
              Login
            </button>
          </div>

          <p className="text-sm mt-6">
            Don’t have an account?
            <Link to="/register" className="text-emerald-600 ml-1">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
