import { initializeApp } from "firebase/app"
import { child, get, getDatabase, ref as refDatabase, set } from "firebase/database"
import {getDownloadURL, getStorage, getStream, ref as refStorage, uploadBytes} from "firebase/storage"
import { firebaseConfig } from "../config/firebaseConfig"
import { BradescoOpinion, Stock } from "../types"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const storage = getStorage(app)

export const Firebase = {
  getStock: async (search: string, org: string) => {
    const data: Stock = await get(
      child(
        refDatabase(database), `${org.toLowerCase()}/${search.toLowerCase()}`
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
    set(refDatabase(database, `${org.toLowerCase()}/${token.toLowerCase()}`), {
      token,
      targetPrice,
      recomendation,
      src,
      href,
      date
    })
  },
  setBradesco: async (BradescoOpinion: BradescoOpinion) => {
    set(refDatabase(database, `bradesco`), BradescoOpinion)
  },
  getBradesco: async () => {
    const data: BradescoOpinion = await get(
      child(
        refDatabase(database), `bradesco`
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
  },
  addFileOnStorage: async (file: any) => {
    uploadBytes(refStorage(storage, 'itau.xlsx'), file)
  },
  getFile: async () => {
    
  }
}