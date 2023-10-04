import { child, get, getDatabase, ref, set } from "firebase/database"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../config/firebaseConfig"
import { BradescoOpinion, Stock } from "../types"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const Firebase = {
  getStock: async (search: string, org: string) => {
    const data: Stock = await get(
      child(
        ref(database), `${org.toLowerCase()}/${search.toLowerCase()}`
      )
    ).then(
      (snapshot) => {
        // console.log(snapshot.val())
        if (snapshot.exists()) {
          return snapshot.val()
        }
      }
    ).catch(
      (err) => {
        console.error(err)
      }
    )
    
    return data    
  },
  setStock: async ({token, date, org, recomendation, src, targetPrice, href}: Stock) => {
    set(ref(database, `${org.toLowerCase()}/${token.toLowerCase()}`), {
      token,
      targetPrice,
      recomendation,
      src,
      href,
      date
    })
  },
  setBradesco: async (BradescoOpinion: BradescoOpinion) => {
    set(ref(database, `bradesco`), BradescoOpinion)
  },
  getBradesco: async () => {
    const data: BradescoOpinion = await get(
      child(
        ref(database), `bradesco`
      )
    ).then(
      (snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        }
      }
    ).catch(
      (err) => {
        console.error(err)
      }
    )

    return data  
  }
}