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

//get total number of questions
const getNumberOfQuestions = async () => {
    let keys = await getAllQuestionKeys()
    let numberOfQuestions = keys.length
    return numberOfQuestions
}

//get all questions from firebase
const getQuestionsFromFirebase = async () => {
    // Get a database reference to our posts 
    let db = admin.database()
    let ref = db.ref("/Quests")

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

const getAllAnswersFromQuestion = async (id) => {
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

const getQuestionFromId = async (id) => {
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

const getAllQuestionKeys = () => new Promise(async (resolve) => {
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

//get key of questions already done by that user
//query only question that done in that round
const getQuestionDone = async (senderID, round) => new Promise(async (resolve) => {
    const db = admin.database()
    const ref = db.ref("/Developer/" + senderID)
    let keysDone = []
    ref.child("results").on("value", (snapshot) => {
        let resultSnapshot = snapshot.val()
        for (let property in resultSnapshot) {
            if (resultSnapshot.hasOwnProperty(property)) {
                if (resultSnapshot[property].round == round) {
                    keysDone.push(resultSnapshot[property].question)
                }
            }
        } 
        resolve(keysDone)
    }, (errorObject) => {
        console.log("Cannot get keys of questions that user already done  = " + errorObject.code)

    })

})

const getQuestionTest = async (senderID, round) => new Promise(async (resolve) => {
    const db = admin.database()
    const ref = db.ref("/Developer/" + senderID)
    let keysDone = []
    ref.child("results").on("value", (snapshot) => {
        let resultSnapshot = snapshot.val()
        console.log("resultSnapshot = ", resultSnapshot)
        for (let property in resultSnapshot) {
            if (resultSnapshot.hasOwnProperty(property)) {
                if (resultSnapshot[property].round == round) {
                    keysDone.push(resultSnapshot[property].question)
                }
            }
        }
        resolve(keysDone)
    }, (errorObject) => {
        console.log("Cannot get keys of questions that user already done  = " + errorObject.code)

    })

})

const saveResultToFirebase = async (senderID, prepareResult) => {
    let result = prepareResult[0]
    let keyQuestion = result.question
    console.log("key = ", keyQuestion)
    let db = admin.database()
    let ref = db.ref("/Developer/" + senderID)
    ref.child("results").push({
        "answer": result.answer,
        "doneAt": result.doneAt,
        "startedAt": result.startedAt,
        "duration": result.duration,
        "point": result.point,
        "question": result.question,
        "result": result.result,
        "round": result.round,
        "score": result.score
    })
}

const saveUserToFirebase = (senderID, user) => {
    console.log("User in firebase= ", user)
    let db = admin.database()
    let ref = db.ref("/Developer/")
    let hasUser = false
    //check if firebase has that user data 
    ref.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                console.log("chilssnapshot = ", childSnapshot.key)
                if (childSnapshot.key == senderID) {
                    console.log("Already have user information")
                    hasUser = true
                    return
                }
            });
        });

    //if firebase doesn't have user data
    ref = db.ref("/Developer/" + senderID)
    ref.update({ profile: user })
}

const saveSummaryToFirebase = (senderID, summary) => {
    let db = admin.database()
    let ref = db.ref("/Developer/" + senderID)
    ref.child("summary").child(summary.round).update({
        "round": summary.round,
        "done": summary.done,
        "keysQuestionLeft": summary.keysQuestionLeft,
        "skill": summary.skill,
        "grade": summary.grade,
        "score": summary.score,
        "totalScore": summary.totalScore
    })
}

module.exports = {
    connectToFirebase, getQuestionsFromFirebase, getAllAnswersFromQuestion, getQuestionFromId,
    getAllQuestionKeys, saveResultToFirebase, saveUserToFirebase, saveSummaryToFirebase, getNumberOfQuestions, getQuestionDone,
    getQuestionTest
}

