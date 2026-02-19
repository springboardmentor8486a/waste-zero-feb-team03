export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <input
        placeholder="Search..."
        className="border rounded-md px-3 py-1 text-sm w-64"
      />

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Ganesh</span>
        <div className="w-8 h-8 rounded-full bg-emerald-500"></div>
      </div>

    </header>
  )
}
