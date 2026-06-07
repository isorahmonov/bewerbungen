'use client'

import { useState, useRef } from 'react'
import { addBewerbung } from '@/app/actions'

export default function AddForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await addBewerbung(formData)
    formRef.current?.reset()
    setOpen(false)
    setLoading(false)
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Neue Bewerbung
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Neue Bewerbung hinzufügen</h2>
          <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unternehmen <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="unternehmen"
                type="text"
                placeholder="z.B. Siemens AG"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ausbildungsrichtung <span className="text-red-500">*</span>
              </label>
              <input
                name="richtung"
                type="text"
                required
                placeholder="z.B. Fachinformatiker"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stadt <span className="text-red-500">*</span>
              </label>
              <input
                name="stadt"
                type="text"
                required
                placeholder="z.B. München"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum gesendet <span className="text-red-500">*</span>
              </label>
              <input
                name="datum"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link zur Stelle <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="link"
                type="url"
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail <span className="text-gray-400 font-normal">(optional, an welche E-Mail gesendet)</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="z.B. bewerbung@firma.de"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ansprechperson <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="ansprechperson"
                type="text"
                placeholder="z.B. Frau Müller"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notizen <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="notizen"
                rows={2}
                placeholder="z.B. Telefonisch nachgefragt am..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Speichern...' : 'Bewerbung speichern'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2 rounded-lg transition-colors text-sm"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
