import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r">

      <div className="p-6 text-xl font-bold text-emerald-600">
        WasteZero
      </div>

      <nav className="px-4 space-y-2 text-sm">

        <NavLink
          to="/dashboard"
          className="block px-4 py-2 rounded hover:bg-emerald-50">
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className="block px-4 py-2 rounded hover:bg-emerald-50">
          My Profile
        </NavLink>

        <NavLink
          to="/analytics"
          className="block px-4 py-2 rounded hover:bg-emerald-50">
          Analytics
        </NavLink>

      </nav>
    </aside>
  )
}
