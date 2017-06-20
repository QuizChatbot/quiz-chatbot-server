const _ = require('lodash');
const array = require('lodash/array')

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



module.exports = { shuffleKeyFromQuestions, _ }