const connectToFirebase = () => {
    const admin = require("firebase-admin");
    let serviceAccount = require("./config/quizchatbot-ce222-firebase-adminsdk.json")
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://quizchatbot-ce222.firebaseio.com/"
    })
    return admin
}
const admin = connectToFirebase()

const readQuestionsFromFirebase = async () => {
    // Get a database reference to our posts 
    var db = admin.database()
    var ref = db.ref("/Quests")

    let questionSnapshots
    // Attach an asynchronous callback to read the data at our posts reference
    const result = await new Promise(function (resolve, reject) {
        ref.on("value", (snapshot) => {
            questionSnapshots = snapshot.val()
            resolve(questionSnapshots)
        }, (errorObject) => {
            reject(errorObject)
            console.log("The read failed: " + errorObject.code)
        })
    }).then((questionSnapshots) => {
        return questionSnapshots
    }).catch((errorObject) => {
        return errorObject.code
    })

    return result
}

const getAllAnswerFromQuestion = async (id) =>{
    var db = admin.database()
    var ref = db.ref("/Quests")

    const result = await new Promise(function (resolve, reject) {
        ref.child(id).child("answers").on("value", (snapshot) => {
            questionSnapshots = snapshot.val()
            resolve(questionSnapshots)
        }, (errorObject) => {
            reject(errorObject)
            console.log("The read failed: " + errorObject.code)
        })
    }).then(function (questionSnapshots) {
        return questionSnapshots
    }).catch(function (errorObject) {
        return "The read failed: " + errorObject.code
    })

    //console.log('from promise', result)
    return result
}

const getQuestionFromId = async (id) =>{
    var db = admin.database()
    var ref = db.ref("/Quests")

    const result = await new Promise(function (resolve, reject) {
        ref.child(id).on("value", (snapshot) => {
            questionSnapshots = snapshot.val()
            resolve(questionSnapshots)
        }, (errorObject) => {
            reject(errorObject)
            console.log("The read failed: " + errorObject.code)
        })
    }).then(function (questionSnapshots) {
        return questionSnapshots
    }).catch(function (errorObject) {
        return "The read failed: " + errorObject.code
    })
    
    return result
}

const getAllQuestionKeys = ()=> new Promise(async (resolve) => {
    const questions = await readQuestionsFromFirebase()
    const db = admin.database()
    const ref = db.ref("/Quests")
    
    ref.orderByKey().once("value", (snapshot) => {
            let keys = Object.keys(snapshot.val())
            console.log("keys in getAllQuestionKeys =  " + keys) 
            resolve(keys)
        }, (errorObject) => {
            console.log("Cannot get keys = " + errorObject.code)
        })
   
})


module.exports = { connectToFirebase, readQuestionsFromFirebase, getAllAnswerFromQuestion, getQuestionFromId, getAllQuestionKeys }

