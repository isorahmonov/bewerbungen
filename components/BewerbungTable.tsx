'use client'

import { useState } from 'react'
import { updateStatus, deleteBewerbung } from '@/app/actions'
import type { Bewerbung, Status } from '@/lib/supabase'
import { findRichtung } from '@/lib/richtungen'

// Name für die Unterschrift in der E-Mail
const BEWERBER_NAME = 'Assia Ezzerouali'

// Öffnet Gmail mit fertigem Betreff und Text.
// Die Dateien (Anschreiben, Lebenslauf, Zeugnisse) hängt Rihab selbst an.
function emailVorbereiten(b: Bewerbung) {
  const r = findRichtung(b.richtung)
  const richtungName = r ? r.voll : b.richtung

  const anrede = b.ansprechperson?.trim()
    ? `Sehr geehrte/r ${b.ansprechperson.trim()},`
    : 'Sehr geehrte Damen und Herren,'

  const unternehmenTeil = b.unternehmen?.trim()
    ? `in Ihrem Unternehmen ${b.unternehmen.trim()} in ${b.stadt}`
    : `in Ihrem Unternehmen in ${b.stadt}`

  const beginnTeil = b.beginn?.trim() ? ` zum ${b.beginn.trim()}` : ''

  const betreff = `Bewerbung um einen Ausbildungsplatz als ${richtungName}`

  const body = `${anrede}

hiermit bewerbe ich mich um einen Ausbildungsplatz als ${richtungName} ${unternehmenTeil}${beginnTeil}.

Anbei sende ich Ihnen mein Anschreiben, meinen Lebenslauf sowie meine Zeugnisse und Bescheinigungen.

Ich freue mich auf eine positive Rückmeldung.

Mit freundlichen Grüßen
${BEWERBER_NAME}`

  const url =
    `mailto:${encodeURIComponent(b.email ?? '')}` +
    `?subject=${encodeURIComponent(betreff)}` +
    `&body=${encodeURIComponent(body)}`

  window.location.href = url
}

const STATUS_LABELS: Record<Status, string> = {
  ausstehend: 'Ausstehend',
  zusage: 'Zusage',
  absage: 'Absage',
  email_senden: 'Per E-Mail senden',
}

const STATUS_STYLES: Record<Status, string> = {
  ausstehend: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  zusage: 'bg-green-100 text-green-800 border border-green-200',
  absage: 'bg-red-100 text-red-800 border border-red-200',
  email_senden: 'bg-blue-100 text-blue-800 border border-blue-200',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function BewerbungTable({ data }: { data: Bewerbung[] }) {
  const [filter, setFilter] = useState<Status | 'alle'>('alle')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const filtered = data.filter((b) => {
    const matchStatus = filter === 'alle' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      b.richtung.toLowerCase().includes(q) ||
      b.stadt.toLowerCase().includes(q) ||
      (b.unternehmen?.toLowerCase().includes(q) ?? false)
    return matchStatus && matchSearch
  })

  async function handleDelete(id: number) {
    if (!confirm('Bewerbung wirklich löschen?')) return
    setDeleting(id)
    await deleteBewerbung(id)
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
        <div className="flex gap-2">
          {(['alle', 'ausstehend', 'email_senden', 'zusage', 'absage'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'alle' ? 'Alle' : STATUS_LABELS[s]}
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
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Senden</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Unternehmen</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Ausbildung</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stadt</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Gesendet</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Link</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">E-Mail</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Ansprechperson</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Notizen</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => emailVorbereiten(b)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      title="Gmail mit fertigem Betreff und Text öffnen"
                    >
                      📧 E-Mail
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {b.unternehmen || <span className="text-gray-400 italic">–</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.richtung}</td>
                  <td className="px-4 py-3 text-gray-700">{b.stadt}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.datum)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as Status)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_STYLES[b.status]}`}
                    >
                      <option value="ausstehend">Ausstehend</option>
                      <option value="email_senden">Per E-Mail senden</option>
                      <option value="zusage">Zusage</option>
                      <option value="absage">Absage</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {b.link ? (
                      <a
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs truncate max-w-[120px] block"
                      >
                        🔗 Link
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-xs">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {b.email || <span className="text-gray-400 italic">–</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {b.ansprechperson || <span className="text-gray-400 italic">–</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={b.notizen ?? undefined}>
                    {b.notizen || <span className="text-gray-400 italic">–</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 text-lg"
                      title="Löschen"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
