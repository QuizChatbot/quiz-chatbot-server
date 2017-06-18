const _ = require('lodash');
const array = require('lodash/array')
const firebase = require('./firebase.js')

const shuffleKeyFromQuestions = function(keys) {
    console.log("shuffle function")
    if(keys == null) { 
        console.log("keys are null")
        return null
    }
    else{
        let shuffled = _.shuffle(keys)
        return shuffled[0]
    }
//    let keys = []

//    //get all key in questions
//    for (let key in questions) {
//        keys.push(key)
//    }
//    //shuffle key and return thr first element
//     for (let i = keys.length; i; i--) {
//         let j = Math.floor(Math.random() * i);
//         [keys[i - 1], keys[j]] = [keys[j], keys[i - 1]];
//     }

//     return keys[0]  
}



module.exports={shuffleKeyFromQuestions, _}