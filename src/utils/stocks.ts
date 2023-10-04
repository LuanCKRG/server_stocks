
export const getRecomedation = (subTitle: string) => {
  const recomendations: string[] = ["neutra", "compra", "venda", "revisão", "outperform"]

  for (const recomendation of recomendations) {
    if (subTitle.toLowerCase().includes(recomendation)) {
      return recomendation
    }
  }

  return "Não foi possível obter a recomendação"
}

export const getToken = (phrase: string) => {
  for (const word of phrase.split(" ")) {
    if (/[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{4}[0-9]/.test(word)) {
      const title = word.replace(/[:()]/g, "")
      return title
    }
  }

  return "Não foi possível obter o token"
}

export const getTargetPrice = (subTitle: string) => {
  for (const word of subTitle.split(" ")) {
    if (/[R]?[$]?[ ]?(\d{2}\,?\.?)/.test(word) && (word.length <= 5)) {
      return word
    }
  }

  return "Indeterminado"
}

export const getDate = (phrase: string) => {
  for (const word of phrase.split(" ")) {
    if (word.includes('-')) {
      return word
    }
  }
}

export const diffInDays = (date1: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24
  const date2 = new Date()

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())

  const result = Math.floor((utc2 - utc1) / msPerDay)
  
  return result
}