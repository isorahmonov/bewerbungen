import type { Bewerbung } from '@/lib/supabase'

export default function Stats({ data }: { data: Bewerbung[] }) {
  const total = data.length
  const zusagen = data.filter((b) => b.status === 'zusage').length
  const absagen = data.filter((b) => b.status === 'absage').length
  const ausstehend = data.filter((b) => b.status === 'ausstehend').length

  const stats = [
    { label: 'Gesamt', value: total, color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Ausstehend', value: ausstehend, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { label: 'Zusagen', value: zusagen, color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Absagen', value: absagen, color: 'bg-red-50 border-red-200 text-red-700' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
          <p className="text-3xl font-bold">{s.value}</p>
          <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
