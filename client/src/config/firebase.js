import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyA3iSHbBSRBMGCvxsmHzQWG296s0j0vcCo",
    authDomain: "quizchatbot-ce222.firebaseapp.com",
    databaseURL: "https://quizchatbot-ce222.firebaseio.com",
    projectId: "quizchatbot-ce222",
    storageBucket: "quizchatbot-ce222.appspot.com",
    messagingSenderId: "590375043489"
}

firebase.initializeApp(config)
export default firebase
export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth()