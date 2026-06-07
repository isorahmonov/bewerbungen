// Zentrale Konfiguration aller Ausbildungsrichtungen.
// key    = Kürzel, wird für die Dateinamen verwendet (Anschreiben_Assia_<key>.pdf)
// voll   = vollständiger Name, wird in der DB gespeichert und in der E-Mail verwendet
// label  = Anzeige im Dropdown (mit Kürzel als Hilfe)

export interface Richtung {
  key: string
  voll: string
  label: string
}

export const RICHTUNGEN: Richtung[] = [
  {
    key: 'MFA',
    voll: 'Medizinische Fachangestellte (m/w/d)',
    label: '[MFA] – Medizinische Fachangestellte (m/w/d)',
  },
  {
    key: 'MFA_D',
    voll: 'Medizinische Fachangestellte für Dialyse (m/w/d)',
    label: '[MFA_D] – Medizinische Fachangestellte für Dialyse (m/w/d)',
  },
  {
    key: 'ATA',
    voll: 'Anästhesietechnische:r Assistent:in (m/w/d)',
    label: '[ATA] – Anästhesietechnische:r Assistent:in (m/w/d)',
  },
  {
    key: 'OTA',
    voll: 'Operationstechnische:r Assistent:in (m/w/d)',
    label: '[OTA] – Operationstechnische:r Assistent:in (m/w/d)',
  },
  {
    key: 'PTP',
    voll: 'Physiotherapeut/in (m/w/d)',
    label: '[PTP] – Physiotherapeut/in (m/w/d)',
  },
  {
    key: 'ZFA',
    voll: 'Zahnmedizinische Fachangestellte (m/w/d)',
    label: '[ZFA] – Zahnmedizinische Fachangestellte (m/w/d)',
  },
]

// Findet die Richtung anhand des gespeicherten vollen Namens (oder Kürzels als Fallback).
export function findRichtung(value: string): Richtung | undefined {
  return RICHTUNGEN.find((r) => r.voll === value || r.key === value)
}
