import { supabase, type Bewerbung } from '@/lib/supabase'
import AddForm from '@/components/AddForm'
import BewerbungTable from '@/components/BewerbungTable'
import Stats from '@/components/Stats'

export const dynamic = 'force-dynamic'

async function getBewerbungen(): Promise<Bewerbung[]> {
  const { data, error } = await supabase.from('bewerbungen').select('*').order('datum', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export default async function Home() {
  const bewerbungen = await getBewerbungen()
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📬 Bewerbungen</h1>
          <p className="text-gray-500 mt-1">Verfolge alle deine Ausbildungsbewerbungen</p>
        </div>
        <div className="mb-6"><Stats data={bewerbungen} /></div>
        <div className="mb-6"><AddForm /></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <BewerbungTable data={bewerbungen} />
        </div>
      </div>
    </main>
  )
}