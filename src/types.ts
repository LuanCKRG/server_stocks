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

export interface BradescoTable {
  year: string
  cambio: string
}

export interface BradescoOpinion {
  name: string
  table: BradescoTable[]
  date: string
  href: string
  src: string
}

export interface FinalResult {
  stocks: Stock[]
  bradesco: BradescoOpinion
}