export default function PasswordForm() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h3 className="font-semibold mb-4">
        Change Password
      </h3>

      <div className="space-y-4">

        <div>
          <label className="text-sm">Current Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm">New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <button className="bg-emerald-600 text-white px-5 py-2 rounded">
          Update Password
        </button>

      </div>
    </div>
  )
}
