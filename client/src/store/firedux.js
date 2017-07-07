import Firedux from '../libs/firedux'
import firebase from 'firebase'

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA3iSHbBSRBMGCvxsmHzQWG296s0j0vcCo",
  authDomain: "quizchatbot-ce222.firebaseapp.com",
  databaseURL: 'https://quizchatbot-ce222.firebaseio.com'
})

const ref = firebaseApp.database().ref()
const firedux = new Firedux({
  ref
})

export default firedux