'use client'

import { useState, useRef, useEffect } from 'react'
import { addBewerbung } from '@/app/actions'

const RICHTUNGEN = ['MFA', 'ATA', 'OTA', 'MFA_D', 'PTP', 'ZFA']
const VERWALTER = ['Iso', 'Rihab']

export default function AddForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [von, setVon] = useState<string | null>(null)
  const [bewerber, setBewerber] = useState('Assia')
  const [editBewerber, setEditBewerber] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [tempBewerber, setTempBewerber] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const savedVon = localStorage.getItem('von')
    const savedBewerber = localStorage.getItem('bewerber')
    if (savedVon) {
      setVon(savedVon)
    } else {
      setShowPicker(true)
    }
    if (savedBewerber) setBewerber(savedBewerber)
  }, [])

  function selectVon(name: string) {
    localStorage.setItem('von', name)
    setVon(name)
    setShowPicker(false)
  }

  function saveBewerber() {
    if (!tempBewerber.trim()) return
    localStorage.setItem('bewerber', tempBewerber.trim())
    setBewerber(tempBewerber.trim())
    setEditBewerber(false)
  }

  async function handleSubmit(formData: FormData) {
    formData.append('von', von ?? 'Unbekannt')
    formData.append('bewerber', bewerber)
    setLoading(true)
    await addBewerbung(formData)
    formRef.current?.reset()
    setOpen(false)
    setLoading(false)
  }

  if (showPicker) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full max-w-sm">
          <p className="text-2xl mb-2">👋</p>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Wer bist du?</h2>
          <p className="text-gray-500 text-sm mb-6">Wähle deinen Namen einmalig aus</p>
          <div className="flex gap-4 justify-center">
            {VERWALTER.map((n) => (
              <button key={n} onClick={() => selectVon(n)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-colors">
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header mit Bewerber und Von */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Bewerbungen für:</span>
          {editBewerber ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={tempBewerber}
                onChange={(e) => setTempBewerber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveBewerber()}
                placeholder={bewerber}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={saveBewerber} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg">OK</button>
              <button onClick={() => setEditBewerber(false)} className="text-gray-400 text-xs px-2 py-1">Abbrechen</button>
            </div>
          ) : (
            <button onClick={() => { setTempBewerber(bewerber); setEditBewerber(true) }} className="font-semibold text-blue-700 hover:underline flex items-center gap-1">
              {bewerber} <span className="text-gray-400 text-xs">✏️</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>👤 {von}</span>
          <button onClick={() => setShowPicker(true)} className="text-xs text-blue-500 hover:underline">wechseln</button>
        </div>
      </div>

      <button onClick={() => setOpen(!open)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
        <span className="text-lg leading-none">+</span> Neue Bewerbung
      </button>

      {open && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 mt-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Neue Bewerbung für <span className="text-blue-600">{bewerber}</span> <span className="text-gray-400 font-normal text-sm">von {von}</span>
          </h2>
          <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unternehmen <span className="text-gray-400">(optional)</span></label>
              <input name="unternehmen" type="text" placeholder="z.B. Siemens AG" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ausbildungsrichtung <span className="text-red-500">*</span></label>
              <select name="richtung" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">– bitte wählen –</option>
                {RICHTUNGEN.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stadt <span className="text-red-500">*</span></label>
              <input name="stadt" type="text" required placeholder="z.B. München" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum gesendet <span className="text-red-500">*</span></label>
              <input name="datum" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Link zur Stelle <span className="text-gray-400">(optional)</span></label>
              <input name="link" type="url" placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
                {loading ? 'Speichern...' : 'Bewerbung speichern'}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2 rounded-lg transition-colors text-sm">
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
