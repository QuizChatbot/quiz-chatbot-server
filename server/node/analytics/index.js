const ua = require('universal-analytics')
const config = require('../config')

let UNIVERSAL_ANALYTICS = config.UNIVERSAL_ANALYTICS

let sessions = {}


function track(eventName, payload) {
    // console.log('track', eventName, payload)
}

function getVisitorFromFBID(id) {
    let visitor = null
    // let visitor = ua.Visitor({tid: UNIVERSAL_ANALYTICS, uid: id})
    visitor = ua(UNIVERSAL_ANALYTICS, id, { strictCidFormat: false })
    console.log("have visitor2 = ", visitor)
    sessions[id] = visitor.cid
    // console.log("cid = ", visitor.cid)
    return visitor
}

function welcome(id) {
    let visitor = getVisitorFromFBID(id)
    visitor.pageview("/welcome", "http://quizchatbot-ce222.firebaseapp.com/", "Welcome").send()
   
    visitor.event("Welcome", "Received welcome").send()
}

function playing(id, round) {
    let visitor = getVisitorFromFBID(id)
    console.log("__playing__", id, visitor)
    visitor.pageview("/playing", "http://quizchatbot-ce222.firebaseapp.com/", `Playing round_${round}`, (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "playing", "playing").send()
}

function answer(id, result, question, duration, cat) {
    let visitor = getVisitorFromFBID(id)
    console.log("__answer__", id, visitor, result, question, duration, cat)
    // visitor.event("Playing", "answer question", "result", result).send()
    // visitor.timing("user answered question", "question duration", duration).send()
    // visitor.pageview(`/questions/${cat}`, "http://quizchatbot-ce222.firebaseapp.com/", `Answer question_${question}`, (err) => {
    //     console.log("Analytics error = ", err)
    // }) 
}

function chooseCategory(id, cat) {
    let visitor = getVisitorFromFBID(id)
    console.log("__choose cat__", id, visitor, cat)
    visitor.event("Playing", "choose category", "category", cat).send()
    visitor.pageview(`/category/${cat}`, "http://quizchatbot-ce222.firebaseapp.com/", "Category", (err) => {
        console.log("Analytics error = ", err)
    })
}

function nextRound(id, round, cat) {
    let visitor = getVisitorFromFBID(id)
    console.log("__next round__", id, visitor, round, cat)
    visitor.pageview(`/questions/${cat}`, "http://quizchatbot-ce222.firebaseapp.com/", `Next round_${round}`, (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "play next round", "round", round).send()
}

function finish(id, round, cat, roundDuration) {
    let visitor = getVisitorFromFBID(id)
    console.log("__finish round__", id, visitor, round)
    visitor.pageview(`/questions/${cat}`, "http://quizchatbot-ce222.firebaseapp.com/", `finish round_${round}`, (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "finish round", "round", round).send()
    visitor.event("Playing", "finish round", "round duration", roundDuration).send()
} 


function resume(id) {
    let visitor = getVisitorFromFBID(id)
    console.log("__resume__", id, visitor)
    visitor.pageview("/questions", "http://quizchatbot-ce222.firebaseapp.com/", "resume", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Resume", "resume").send()
}

function pause(id) {
    let visitor = getVisitorFromFBID(id)
    console.log("__pause__", id, visitor)
    visitor.pageview("/pause", "http://quizchatbot-ce222.firebaseapp.com/", "pause", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Pause", "pause").send()
}

module.exports = { track, playing, getVisitorFromFBID, welcome, answer, chooseCategory, nextRound, finish, resume, pause }
