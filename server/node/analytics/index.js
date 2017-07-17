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

function welcome(user) {
    let visitor = getVisitorFromFBID(user)
    console.log('__Welcome__', user, visitor)
    visitor.pageview("/").send()
    // visitor.pageview("/","http://quizchatbot-ce222.firebaseapp.com/", "welcome").send()
    visitor.event("Welcome", "Received welcome").send()
}

function startQuiz(user) {
    let visitor = getVisitorFromFBID(user)
    console.log('__startQuiz__', user, visitor)
    visitor.pageview("/", "http://quizchatbot-ce222.firebaseapp.com/", "Welcome", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Chat", "Received message").send()
}

function playing(user) {
    console.log('__playing__', user, visitor)
    visitor.pageview("/", "http://quizchatbot-ce222.firebaseapp.com/", "Playing", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "playing").send()
}

function answer(user, result) {
    let visitor = getVisitorFromFBID(user)
    console.log('__answer__', user, visitor)
    visitor.pageview("/questions", "http://quizchatbot-ce222.firebaseapp.com/", "Playing", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "answer question", "result", result).send()
}

module.exports = { track, startQuiz, playing, getVisitorFromFBID, welcome, answer }
