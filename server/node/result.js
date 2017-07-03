const utillArray = require('./utill_array')

//set format of the result we want to save in firebase
const prepareResultForFirebase = async (payload, answerForEachQuestion, result, startedAt, timeOfPostback, scoreOfThatQuestion, senderID) => {
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
    userAnswerObj.round = user.state.round
    userAnswerObj.score = scoreOfThatQuestion
    prepareObj.push(userAnswerObj)
    console.log("result = ", prepareObj)
    return prepareObj 
}

module.exports = {prepareResultForFirebase}