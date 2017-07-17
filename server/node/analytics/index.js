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

function startQuiz(user) {
    let visitor = getVisitorFromFBID(user)
    console.log('__startQuiz__', user, visitor)
    visitor.pageview("/", "http://quizchatbot-ce222.firebaseapp.com/", "Welcome", (err) => {
        console.log("Analytics error = ", err)
    })
    visitor.event("Chat", "Received message").send()
}

function playing(user, visitor) {
    console.log('__playing__', user, visitor)
    visitor.pageview("/", "http://quizchatbot-ce222.firebaseapp.com/", "Playing", function (err) {
        console.log("Analytics error = ", err)
    })
    visitor.event("Playing", "Answer quesyion").send()
}

module.exports = { track, startQuiz, playing, getVisitorFromFBID }
