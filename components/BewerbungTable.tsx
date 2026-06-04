'use client'

import { useState } from 'react'
import { updateStatus, deleteBewerbung } from '@/app/actions'
import type { Bewerbung, Status } from '@/lib/supabase'

const STATUS_LABELS: Record<Status, string> = {
  ausstehend: 'Ausstehend',
  zusage: 'Zusage',
  absage: 'Absage',
}

const STATUS_STYLES: Record<Status, string> = {
  ausstehend: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  zusage: 'bg-green-100 text-green-800 border border-green-200',
  absage: 'bg-red-100 text-red-800 border border-red-200',
}

const VON_STYLES: Record<string, string> = {
  Iso: 'bg-purple-100 text-purple-700',
  Rihab: 'bg-pink-100 text-pink-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function BewerbungTable({ data }: { data: Bewerbung[] }) {
  const [filter, setFilter] = useState<Status | 'alle'>('alle')
  const [filterVon, setFilterVon] = useState<string>('alle')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const filtered = data.filter((b) => {
    const matchStatus = filter === 'alle' || b.status === filter
    const matchVon = filterVon === 'alle' || b.von === filterVon
    const q = search.toLowerCase()
    return matchStatus && matchVon && (!q || b.richtung.toLowerCase().includes(q) || b.stadt.toLowerCase().includes(q) || (b.unternehmen?.toLowerCase().includes(q) ?? false) || b.bewerber.toLowerCase().includes(q))
  })

  async function handleDelete(id: number) {
    if (!confirm('Bewerbung wirklich löschen?')) return
    setDeleting(id)
    await deleteBewerbung(id)
    setDeleting(null)
  }

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48" />
        <div className="flex flex-wrap gap-2">
          {(['alle', 'ausstehend', 'zusage', 'absage'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s === 'alle' ? 'Alle' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['alle', 'Iso', 'Rihab'] as const).map((n) => (
            <button key={n} onClick={() => setFilterVon(n)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterVon === n ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {n === 'alle' ? 'Alle' : n}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-medium">Keine Bewerbungen gefunden</p>
          <p className="text-sm mt-1">Füge deine erste Bewerbung hinzu!</p>
        </div>
      ) : (
        <>
          {/* Mobile Karten */}
          <div className="sm:hidden space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${VON_STYLES[b.von] ?? 'bg-gray-100 text-gray-700'}`}>{b.von}</span>
                    <span className="text-xs text-gray-500">für {b.bewerber}</span>
                  </div>
                  <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} className="text-gray-400 hover:text-red-500 text-lg">×</button>
                </div>
                <p className="font-semibold text-gray-800">{b.unternehmen || <span className="text-gray-400 italic">Kein Unternehmen</span>}</p>
                <p className="text-sm text-gray-600">{b.richtung} · {b.stadt}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(b.datum)}</p>
                <div className="flex items-center justify-between mt-3">
                  <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as Status)} className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 focus:outline-none ${STATUS_STYLES[b.status]}`}>
                    <option value="ausstehend">Ausstehend</option>
                    <option value="zusage">Zusage</option>
                    <option value="absage">Absage</option>
                  </select>
                  {b.link && <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline">🔗 Link</a>}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Tabelle */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Von</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Bewerber</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Unternehmen</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Richtung</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Stadt</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Gesendet</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Link</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${VON_STYLES[b.von] ?? 'bg-gray-100 text-gray-700'}`}>{b.von}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{b.bewerber}</td>
                    <td className="px-4 py-3 text-gray-700">{b.unternehmen || <span className="text-gray-400 italic">–</span>}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{b.richtung}</td>
                    <td className="px-4 py-3 text-gray-700">{b.stadt}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(b.datum)}</td>
                    <td className="px-4 py-3">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as Status)} className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_STYLES[b.status]}`}>
                        <option value="ausstehend">Ausstehend</option>
                        <option value="zusage">Zusage</option>
                        <option value="absage">Absage</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {b.link ? <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">🔗 Link</a> : <span className="text-gray-400 italic text-xs">–</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 text-lg">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}