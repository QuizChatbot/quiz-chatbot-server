const _ = require('lodash')
const moment = require('moment')

const shuffleKeyFromQuestions = (keys) => {
    console.log("shuffle function")
    if (keys == null) {
        console.log("keys are null")
        return null
    }
    else {
        let shuffled = _.shuffle(keys)
        return shuffled[0]
    }
}

const shuffleChoices = (choices) => {
    if (choices == null) {
        console.log("choices are null")
        return null
    }
    else {
        let shuffled = _.shuffle(choices)
        return shuffled
    }
}

// const startTimer = () => {
//     console.time('questionDuration')
// }

const getMoment = () => {
    return moment().format()   
}

// const stopTimer = () => {
//     let time = console.timeEnd('questionDuration')
//     console.log("time = ", time)
// }

const getFormattedDate = (timestamp) => {
    let date = moment(timestamp).format()
    return date
}

const calculateDuration = (startedAt, timeOfPostback) => {
    let doneAt = moment(timeOfPostback)
    let duration = moment.duration(doneAt.diff(startedAt))
    return duration.asMilliseconds()
}

module.exports = { shuffleKeyFromQuestions, _, getMoment, calculateDuration, shuffleChoices, getFormattedDate}