export interface Stock {
  token: string
  targetPrice: string
  recomendation: string
  src: string
  href: string
  date: string
  org: Org
  created_at: Date
}

export type Org = 'xp' | 'safra' | 'inter' | 'btg'

export interface CambioTable {
  year: string
  cambio: string
}

export interface CambioSheet {
  name: string
  table: CambioTable[]
  date: string
  href: string
  src: string
}

export interface FinalResult {
  stocks: Stock[]
  sheets: CambioSheet[]
}