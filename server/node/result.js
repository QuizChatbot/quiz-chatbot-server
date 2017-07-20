const utillArray = require('./utill_array')


/**
 * Set format of the result of answered question we want to save in firebase
 * @param {object} payload 
 * @param {[string]} answerForEachQuestion 
 * @param {number} round 
 * @param {boolean} result - answer correct/wrong
 * @param {string} startedAt - formatted date of timestamp
 * @param {string} timeOfPostback - timestamp
 * @param {number} scoreOfThatQuestion 
 * @param {string} senderID 
 * @param {string} category 
 * @return {object}
 * @async
 */
const prepareResultForFirebase = async (payload, round, result, timeOfStart, timeOfPostback, scoreOfThatQuestion, senderID, category) => {
    //in payload contain answer, question key, point
    let prepareObj = []
    let userAnswerObj = payload
    let startedAt = utillArray.getFormattedDate(timeOfStart)
    let doneAt = utillArray.getFormattedDate(timeOfPostback)
    let duration = utillArray.calculateDuration(timeOfStart, timeOfPostback)

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