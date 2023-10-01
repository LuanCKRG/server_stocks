export interface Stock {
  token: string
  targetPrice: string
  recomendation: string
  src: string
  href: string
  date: string
  org: Org
}

export type Org = 'xp' | 'safra' | 'inter' | 'btg'