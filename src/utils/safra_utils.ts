
export const getRecomedation = (subTitle: string) => {
  const recomendations: string[] = ['neutra', 'compra', 'venda', 'revisão']

  for (const recomendation of recomendations) {
    if (subTitle.toLowerCase().includes(recomendation)) {
      return recomendation
    }
  }

  return 'Não foi possível obter a recomendação'
}

export const getToken = (phrase: string) => {
  for (const word of phrase.split(' ')) {
    if (/[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{4}[0-9]/.test(word)) {
      const title = word.replace(/[:()]/g, '')
      return title
    }
  }

  return 'Não foi possível obter o token'
}

export const getTargetPrice = (subTitle: string) => {
  for (const word of subTitle.split(' ')) {
    if (/[R]?[$]?[ ]?(\d{2}\,?\.?)+/.test(word)) {
      return word
    }
  }

  return 'Indeterminado'
}
