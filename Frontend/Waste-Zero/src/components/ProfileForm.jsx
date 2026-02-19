export default function ProfileForm() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h3 className="font-semibold mb-4">
        Personal Information
      </h3>

      <div className="space-y-4">

        <div>
          <label className="text-sm">Full Name</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="text-sm">Location</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="City"
          />
        </div>

        <button className="bg-emerald-600 text-white px-5 py-2 rounded">
          Save Changes
        </button>

      </div>
    </div>
  )
}
