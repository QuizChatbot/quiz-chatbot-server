const _ = require('lodash')
const array = require('lodash/array')
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

const timer = () => {

}

const getFormattedDate = (timestamp) => {
    let date = moment(timestamp).format()
    return date
}



module.exports = { shuffleKeyFromQuestions, _, getFormattedDate }