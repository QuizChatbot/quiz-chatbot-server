const _ = require('lodash')
const moment = require('moment')

/**
 * Shuffle question to ask from questions keys, and return first element of shuffled keys
 * @param {[string]} keys
 * @return {string}
 */
const shuffleKeyFromQuestions = keys => {
  console.log('shuffle function')
  if (keys == null) {
    console.log('keys are null')
    return null
  } else {
    let shuffled = _.shuffle(keys)
    return shuffled[0]
  }
}

/**
 * Shuffle choices to ask from choices of that question
 * @param {[string]} choices
 * @return {[string]}
 */
const shuffleChoices = choices => {
  if (choices == null) {
    console.log('choices are null')
    return null
  } else {
    let shuffled = _.shuffle(choices)
    return shuffled
  }
}

// const startTimer = () => {
//     console.time('questionDuration')
// }

/**
 * Get moment(timestamp) of present time
 * @return {string}
 */
const getMoment = () => {
  return moment().format()
}

// const stopTimer = () => {
//     let time = console.timeEnd('questionDuration')
//     console.log("time = ", time)
// }

/**
 * Change timestamp to date
 * @param {string} timestamp
 * @return {Date}
 */
const getFormattedDate = timestamp => {
  let date = moment(timestamp).format()
  // use Date() like...
  // let date = new Date(timestamp).toISOString()
  return date
}

/**
 * Calculate duration(millisecond) between question  being asked and answered
 * @param {Date} startedAt - date&time when question being asked
 * @param {string} timeOfPostback - timestamp when question being answered
 * @return {number} - in millisecond
 */
const calculateDuration = (startedAt, timeOfPostback) => {
  let doneAt = moment(timeOfPostback)
  let duration = moment.duration(doneAt.diff(startedAt))
  return duration.asMilliseconds()
}

module.exports = {
  shuffleKeyFromQuestions,
  _,
  getMoment,
  calculateDuration,
  shuffleChoices,
  getFormattedDate
}
