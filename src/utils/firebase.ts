import { initializeApp } from "firebase/app"
import { child, get, getDatabase, ref, set } from "firebase/database"

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD3yzY5aA3upV4LiVFoyGRyX2acLS2ND8c",
  authDomain: "api-scrape-stocks.onrender.com",
  projectId: "stocks-ckrg",
  storageBucket: "stocks-ckrg.appspot.com",
  messagingSenderId: "243689990477",
  appId: "1:243689990477:web:4f84ec930beaee21beef04",
  databaseURL: "https://stocks-ckrg-default-rtdb.firebaseio.com/",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const setToken = (token: string, targetPrice: string, recomendation: string, src: string, href: string, date: string, org: string) => {
  set(ref(database, `${org.toLowerCase()}/${token.toLowerCase()}`), {
    token,
    targetPrice,
    recomendation,
    src,
    href,
    date
  })
}

export const getToken = async (search: string, org: 'safra' | 'xp' | 'inter' | 'btg') => {
  const data = await get(
    child(ref(database), `${org.toLowerCase()}/${search.toLowerCase()}`)
  ).then(
    (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
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