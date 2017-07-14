/**
 * Connect to firebase database
 */
const connectToFirebase = () => {
    const admin = require("firebase-admin");
    let serviceAccount = require("./config/quizchatbot-ce222-firebase-adminsdk.json")
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://quizchatbot-ce222.firebaseio.com"
    })
    return admin
}

const admin = connectToFirebase()


/**
 * get total number of questions
 * @param {String} category - category of question
 * @return {Number} 
 * @async
 */
const getNumberOfQuestions = async (category) => {
    let keys = await getAllQuestionKeys(category)
    let numberOfQuestions = keys.length
    return numberOfQuestions
}


/**
 * get all questions from firebase
 * @async
 */
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
            console.log("Cannot get questions from firebase : " + errorObject.code)
        })
    }).then((questionSnapshots) => {
        return questionSnapshots
    }).catch((errorObject) => {
        return errorObject.code
    })

    return result
}

//
/**
 * Get all answers(choices) from that question by id
 * @param {String} id - id of question
 * @return {[String]}
 * @async
 */
const getAllAnswersFromQuestion = async (id) => {
    let db = admin.database()
    let ref = db.ref("/Quests")

    const result = await new Promise(function (resolve, reject) {
        ref.child(id).child("choices").on("value", (snapshot) => {
            questionSnapshots = snapshot.val()
            if (!questionSnapshots) {
                reject("Cannot get all answers from question id : ")
            }
            resolve(questionSnapshots)
        }, (errorObject) => {
            reject("Reject Cannot get all answers from question id : " + errorObject.code)
            console.log("Cannot get all answers from question id : " + errorObject.code)
        })
    })
    // .then((questionSnapshots) => {
    //     return questionSnapshots
    // }).catch((errorObject) => {
    //     return "Reject Cannot get all answers from question id : " + errorObject.code
    // })

    return result
}


/**
 * Get question by id
 * @param {String} id 
 * @return {object}
 * @async
 */
const getQuestionFromId = async (id) => {
    let db = admin.database()
    let ref = db.ref("/Quests")

    const result = await new Promise(function (resolve, reject) {
        ref.child(id).on("value", (snapshot) => {
            questionSnapshots = snapshot.val()
            resolve(questionSnapshots)
        }, (errorObject) => {
            reject(errorObject)
            console.log("Cannot get question from id : " + errorObject.code)
        })
    }).then((questionSnapshots) => {
        return questionSnapshots
    }).catch((errorObject) => {
        return "Reject Cannot get question from id : " + errorObject.code
    })

    return result
}

/**
 * get all questions' keys from firebase by category or get all question keys
 * @param {String} category - category of question
 * @return {[String]}
 * @async
 */
const getAllQuestionKeys = (category) => new Promise(async (resolve, reject) => {
    const db = admin.database()
    const ref = db.ref("/Quests")
    if (!category) {
        ref.orderByKey().once("value", (snapshot) => {
            let keys = Object.keys(snapshot.val())
            console.log("keys in getAllQuestionKeys =  " + keys)
            resolve(keys)
        }, (errorObject) => {
            console.log("Cannot get all question keys = " + errorObject.code)
            reject(errorObject)
        })
    }
    else {
        ref.orderByKey().once("value", (snapshot) => {
            let keys = []
            let questionSnapshots = snapshot.val()
            for (let property in questionSnapshots) {
                if (questionSnapshots.hasOwnProperty(property)) {
                    if (questionSnapshots[property].category === category) {
                        keys.push(property)
                    }
                }
            }
            resolve(keys)
        }, (errorObject) => {
            reject(errorObject)
        })
    }
})


/**
 * Get key of questions already done by that user.
 * Query only question that done in that round+category
 * @param {String} senderID 
 * @param {Number} round 
 * @param {String} category 
 * @return {[string]}
 * @async
 */
const getQuestionDone = async (senderID, round, category) => new Promise(async (resolve) => {
    const db = admin.database()
    const ref = db.ref("/Developer/" + senderID)
    let keysDone = []
    ref.child("results").on("value", (snapshot) => {
        let resultSnapshot = snapshot.val()
        for (let property in resultSnapshot) {
            if (resultSnapshot.hasOwnProperty(property)) {
                //get keys of questions done if that round
                if (resultSnapshot[property].round == round && resultSnapshot[property].category == category) {
                    keysDone.push(resultSnapshot[property].question)
                }
            }
        }
        resolve(keysDone)
    }, (errorObject) => {
        console.log("Cannot get keys of questions that user already done  = " + errorObject.code)

    })

})

/**
 * Get grade of user after finish that round
 * @param {String} senderID 
 * @param {Number} round 
 * @return {String}
 * @async
 */
const getGrade = async (senderID, round) => new Promise(async (resolve) => {
    const db = admin.database()
    const ref = db.ref("/Developer/" + senderID)
    let grade
    ref.child("summary").on("value", (snapshot) => {
        let resultSnapshot = snapshot.val()
        for (let property in resultSnapshot) {
            if (resultSnapshot.hasOwnProperty(property)) {
                if (resultSnapshot[property].round == round) {
                    grade = resultSnapshot[property].grade
                }
            }
        }
        resolve(grade)

    }, (errorObject) => {
        console.log("Cannot get grade of user  = " + errorObject.code)
    })

})



/**
 * Save result of answered question
 * @param {String} senderID 
 * @param {object} prepareResult 
 * @async
 */
const saveResultToFirebase = async (senderID, prepareResult) => {
    let result = prepareResult[0]
    let keyQuestion = result.question
    console.log("key = ", keyQuestion)
    let db = admin.database()
    let ref = db.ref("/Developer/" + senderID)
    //create new key when push
    ref.child("results").push({
        "answer": result.answer,
        "doneAt": result.doneAt,
        "startedAt": result.startedAt,
        "duration": result.duration,
        "point": result.point,
        "question": result.question,
        "result": result.result,
        "round": result.round,
        "score": result.score,
        "category": result.category
    })

    ref = db.ref("/Developer_cheat/" + senderID)
    //create new key when push
    ref.child("results").push({
        "answer": result.answer,
        "doneAt": result.doneAt,
        "startedAt": result.startedAt,
        "duration": result.duration,
        "point": result.point,
        "question": result.question,
        "result": result.result,
        "round": result.round,
        "score": result.score,
        "category": result.category
    })
}

/**
 * Save user profile to firebase
 * @param {String} senderID 
 * @param {object} user - user detail from facebook
 */
const saveUserToFirebase = (senderID, user) => {
    console.log("User in firebase= ", user)
    let db = admin.database()
    let ref = db.ref("/Developer/")
    let hasUser = false
    //check if firebase has that user data 
    ref.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key == senderID) {
                    console.log("Already have user information")
                    hasUser = true
                    return
                }
            })
        })

    //if firebase doesn't have user data
    ref = db.ref("/Developer/" + senderID)
    ref.update({ profile: user })

    //Cheat protected
    ref = db.ref("/Developer_cheat/")
    //check if firebase has that user data 
    ref.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key == senderID) {
                    console.log("Already have user information")
                    hasUser = true
                    return
                }
            })
        })

    //if firebase doesn't have user data
    ref = db.ref("/Developer_cheat/" + senderID)
    ref.update({ profile: user })
}

/**
 * Save summary of answered question to firebase
 * @param {string} senderID 
 * @param {object} summary 
 */
const saveSummaryToFirebase = (senderID, summary) => {
    let db = admin.database()
    let ref = db.ref("/Developer/" + senderID)
    ref.child("summary").child(summary.round).update({
        "round": summary.round,
        "done": summary.done,
        "isDone": summary.isDone,
        "keysQuestionLeft": summary.keysQuestionLeft,
        "category": summary.category,
        "grade": summary.grade,
        "score": summary.score,
        "totalScore": summary.totalScore
    })

    //Cheat protected
    ref = db.ref("/Developer_cheat/" + senderID)
    ref.child("summary").child(summary.round).update({
        "round": summary.round,
        "done": summary.done,
        "isDone": summary.isDone,
        "keysQuestionLeft": summary.keysQuestionLeft,
        "category": summary.category,
        "grade": summary.grade,
        "score": summary.score,
        "totalScore": summary.totalScore
    })
}

module.exports = {
    connectToFirebase, getQuestionsFromFirebase, getAllAnswersFromQuestion, getQuestionFromId,
    getAllQuestionKeys, saveResultToFirebase, saveUserToFirebase, saveSummaryToFirebase, getNumberOfQuestions, getQuestionDone,
    getGrade
}

// exports.testEvent = functions.analytics.event('SELECT_CONTENT').onLog(event => {
 
//     return "testttt"
// })

