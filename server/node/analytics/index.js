const ua = require('universal-analytics')
const config = require('../config')

let UNIVERSAL_ANALYTICS = config.UNIVERSAL_ANALYTICS

function track(eventName, payload) {
    console.log('track', eventName, payload)
}

function startQuiz(user, visitor) {
    console.log('__startQuiz__', user, visitor)
    visitor.pageview("/", "http://quizchatbot-ce222.firebaseapp.com/", "Welcome", function (err) {
        console.log("Analytics error = ", err)
    })
    visitor.event("Chat", "Received message").send()
}

module.exports = { track, startQuiz }
