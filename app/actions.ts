'use server'

import { supabase, type Status } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addBewerbung(formData: FormData) {
  const unternehmen = formData.get('unternehmen') as string | null
  const richtung = formData.get('richtung') as string
  const stadt = formData.get('stadt') as string
  const datum = formData.get('datum') as string
  const link = formData.get('link') as string | null
  const bewerber = formData.get('bewerber') as string
  const von = formData.get('von') as string

  await supabase.from('bewerbungen').insert({
    unternehmen: unternehmen || null,
    richtung,
    stadt,
    datum,
    status: 'ausstehend' as Status,
    link: link || null,
    bewerber,
    von,
  })

  revalidatePath('/')
}

export async function updateStatus(id: number, status: Status) {
  await supabase.from('bewerbungen').update({ status }).eq('id', id)
  revalidatePath('/')
}

export async function deleteBewerbung(id: number) {
  await supabase.from('bewerbungen').delete().eq('id', id)
  revalidatePath('/')
}