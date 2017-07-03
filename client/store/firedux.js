import Firedux from '../libs/firedux'
import firebase from 'firebase'

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA3iSHbBSRBMGCvxsmHzQWG296s0j0vcCo",
  authDomain: "quizchatbot-ce222.firebaseapp.com",
  databaseURL: 'https://quizchatbot-ce222.firebaseio.com'
})

/*let user = "foo" new Promise((resolve, reject) => {
  return firebaseApp.auth().onAuthStateChanged((user) => {
    if (user) {
      resolve({ uid: user.uid })
    }
  })
})
console.log("user=", user)
*/

// uid = uid ? uid : (() => {
//   return (new Date()).getTime() + '-' + Math.floor((Math.random() * 100000))
// })()


const ref = firebaseApp.database().ref()

// const ref = rootRef.child(`users/`)

const firedux = new Firedux({
  ref
})

export default firedux