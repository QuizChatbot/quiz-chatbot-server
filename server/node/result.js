const utillArray = require('./utill_array')

//set format of the result we want to save in firebase
const prepareResultForFirebase = async (payload, answerForEachQuestion, round, result, startedAt, timeOfPostback, scoreOfThatQuestion, senderID, category) => {
    //in payload contain answer, question key, point
    let prepareObj = []
    let userAnswerObj = payload
    let doneAt = utillArray.getFormattedDate(timeOfPostback)
    let duration = utillArray.calculateDuration(startedAt, timeOfPostback)

    //add key to userAnswerObj
    userAnswerObj.result = result
    userAnswerObj.doneAt = doneAt
    userAnswerObj.startedAt = startedAt
    userAnswerObj.duration = duration
    userAnswerObj.round = round
    userAnswerObj.score = scoreOfThatQuestion
    userAnswerObj.category = category
    prepareObj.push(userAnswerObj)
    console.log("result = ", prepareObj)
    return prepareObj 
}

module.exports = {prepareResultForFirebase}