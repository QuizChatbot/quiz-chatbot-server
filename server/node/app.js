require('es6-promise').polyfill()
require('isomorphic-fetch')

const bodyParser = require('body-parser'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request'),
  createButton = require('./create_button'),
  utillArray = require('./utill_array'),
  firebase = require('./firebase'),
  tunnelConfig = require('./tunnel.json'),
  summary = require('./summary'),
  userClass = require('./models/user'),
  resultFirebase = require('./result'),
  api = require('./localUserAPI'),
  messenger = require('./messenger'),
  config = require('./config'),
  emitter = require('./emitter'),
  analytics = require('./analytics')

let APP_SECRET,
  VALIDATION_TOKEN,
  PAGE_ACCESS_TOKEN,
  SERVER_URL,
  UNIVERSAL_ANALYTICS

// emitter.on('*', (type, payload) => analytics.track(type, payload))

emitter.on('welcome', user => {
  analytics.welcome(user.senderID)
})

emitter.on('playing', user => {
  analytics.playing(user.senderID, user.state.round)
})

emitter.on('answer', ({ user, result, question, duration, category }) => {
  analytics.answer(user.senderID, result, question, duration, category)
})

emitter.on('category', ({ user, cat }) => {
  console.log('_______test = ', user.senderID, cat)
  analytics.chooseCategory(user.senderID, cat)
})

emitter.on('nextRound', user => {
  analytics.nextRound(user.senderID, user.state.round, user.state.category)
})

emitter.on('finish', ({ user, roundDuration }) => {
  analytics.finish(
    user.senderID,
    user.state.round,
    user.state.category,
    roundDuration
  )
})

emitter.on('resume', user => {
  analytics.resume(user.senderID)
})

emitter.on('pause', user => {
  analytics.pause(user.senderID)
})

APP_SECRET = config.APP_SECRET
VALIDATION_TOKEN = config.VALIDATION_TOKEN
PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN
SERVER_URL = config.SERVER_URL
UNIVERSAL_ANALYTICS = config.UNIVERSAL_ANALYTICS

/**
 * this is Main messenger app .
 */

/**
 * Main messenger application
 */
const app = async () => {

  // let mitt1 = emitter
  // mitt1.emit('foo', { a: 'b' })
  // const emitter = require('./analytics/emitter2')
  // emitter.emit('foo', { a: 'b2' })
  // emitter.on()

  let app = express()

  app.set('port', process.env.PORT || 4000)
  app.set('view engine', 'ejs')
  app.use(bodyParser.json({ extended: false }))
  app.use(express.static('public'))

  // ua.middleware(UNIVERSAL_ANALYTICS, {uid})

  app.get('/webhook', (req, res) => {
    if (
      req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN
    ) {
      console.log('Validating webhook')
      res.status(200).send(req.query['hub.challenge'])
    } else {
      console.error('Failed validation. Make sure the validation tokens match.')

      res.sendStatus(403)
    }
  })

  /**
   * occur when user send something to bot
   */
  app.post('/webhook', (req, res) => {
    let data = req.body
    // Make sure this is a page subscription
    if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(pageEntry => {
        let pageID = pageEntry.id
        let timeOfEvent = pageEntry.time

        // Iterate over each messaging event
        pageEntry.messaging.forEach(async messagingEvent => {
          console.log('recieve mssg read')
          console.log('mssg.read ', messagingEvent.read)
          console.log('receive mssg')

          // get all question keys and save to usersData for that senderID
          let keysLeftForThatUser = await getKeys()
          // get user if doesn't have this user before
          let user = await userClass.load(
            messagingEvent.sender.id,
            keysLeftForThatUser,
            api
          )

          // get visitor for analytics
          analytics.getVisitorFromFBID(messagingEvent.sender.id)

          if (messagingEvent.optin) {
            receivedAuthentication(messagingEvent)
          } else if (messagingEvent.message) {
            receivedMessage(messagingEvent, user)
          } else if (messagingEvent.delivery) {
            receivedDeliveryConfirmation(messagingEvent)
          } else if (messagingEvent.postback) {
            receivedPostback(messagingEvent, user)
          } else if (messagingEvent.read) {
            receivedMessageRead(messagingEvent)
          } else if (messagingEvent.account_linking) {
            receivedAccountLink(messagingEvent)
          } else {
            console.log(
              'Webhook received unknown messagingEvent: ',
              messagingEvent
            )
          }
        })
      })

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200)
    }
  })

  /*
   * Message Event
   *
   * This event is called when a message is sent to your page. The 'message'
   * object format can vary depending on the kind of message that was received.
   * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
   *
   * For this example, we're going to echo any text that we get. If we get some
   * special keywords ('button', 'generic', 'receipt'), then we'll send back
   * examples of those bubbles to illustrate the special message bubbles we've
   * created. If we receive a message with an attachment (image, video, audio),
   * then we'll simply confirm that we've received the attachment.
   *
   */

  /**
   * When bot received message from user
   * @param {*} event
   * @param {*} user
   */
  async function receivedMessage(event, user) {

    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message

    console.log(
      'Received message for user %d and page %d at %d with message:',
      senderID,
      recipientID,
      timeOfMessage
    )
    console.log(JSON.stringify(message))

    let isEcho = message.is_echo
    let messageId = message.mid
    let appId = message.app_id
    let metadata = message.metadata

    // You may get a text or attachment but not both
    let messageText = message.text
    let messageAttachments = message.attachments
    let quickReply = message.quick_reply

    if (messageText) {
      handleReceivedMessage(user, messageText)
    } else if (messageAttachments) {
      messenger.sendTextMessage(senderID, ':D')
    }
  }

  /*
   * Postback Event
   *
   * This event is called when a postback is tapped on a Structured Message.
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
   *
   */

  /**
   * When bot received postback(ex.click button) from user
   * @param {*} event
   * @param {*} user
   */
  async function receivedPostback(event, user) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfPostback = event.timestamp
    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    let payload = event.postback.payload
    let payloadObj = JSON.parse(payload)
    console.log(
      "Received postback for user %d and page %d with payload '%s' " + 'at %d',
      senderID,
      recipientID,
      payload,
      timeOfPostback
    )

    handleReceivedPostback(user, payloadObj, timeOfPostback)
  }

  // Start server
  // Webhooks must be available via SSL with a certificate signed by a valid
  // certificate authority.
  app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
    messenger.setGreetingText()
  })
}

let timeOfStart

/**
 * Get all questions keys
 * @async
 * @param {String} category - category of question
 * @return {[String]}
 */
async function getKeys(category) {
  let keys
  if (!category) keys = await firebase.getQuestionKeysFromCategory()
  else keys = await firebase.getQuestionKeysFromCategory(category)
  return keys
}

/**
 * Handle received message
 * @async
 * @param {object} user
 * @param {string} messageText
 */
const handleReceivedMessage = async (user, messageText) => {
  if (
    messageText !== 'OK' &&
    user.state.welcomed === true &&
    user.state.state !== 'pause' &&
    user.state.state !== 'finish'
  ) {
    messenger.sendTextMessage(user.senderID, "Please say OK to continue.")
  } else {
    // //other users except the first user will add their profile to firebase
    let userDetail = await messenger.getUserDetail(user.senderID)
    let firstName = userDetail.first_name
    firebase.saveUserToFirebase(user.senderID, userDetail)

    if (user.state.welcomed === false) {
      emitter.emit('welcome', user)
      user.welcome()
      user.choosing()
      messenger.sendTextMessage(
        user.senderID,
        `Welcome to QuizBot! ${firstName}` +
        '\n' +
        `say 'OK' if you want to play`
      )

    } else if (user.state.state === 'playing' || user.state.state === 'pause') {
      // //already quiz with chatbot or user come back after pause
      let keysLeftForThatUser = await firebase.getQuestionKeysFromCategory(user.state.category)
      user.hasKeysLeft(keysLeftForThatUser)
      // get keys question that user done
      let keysDone = await firebase.getQuestionDone(
        user.senderID,
        user.state.round,
        user.state.category
      )

      // remove questions done from questions that not yet answered
      user.removeKeysDone(keysDone)

      // if user pause -> change to playing
      if (user.state.state === 'pause') {
        console.log('_________PAUSE__________')
        user.resume()
        emitter.emit('resume', user)
        // emitter.emit('playing', user)
      } else {
        let timeStartRound = utillArray.getMoment()
        user.setStartRoundTime(timeStartRound)
        emitter.emit('playing', user)
      }

      // //shuffle keys of questions that have not answered
      let shuffledKey = utillArray.shuffleKeyFromQuestions(
        user.state.keysLeftForThatUser
      )
      user.startQuiz(shuffledKey)

      let answersForEachQuestion = await firebase.getAllAnswersFromQuestion(
        shuffledKey
      )
      if (answersForEachQuestion == null) {
        console.log("Doesn't have this id in questions database")
        return null
      }
      user.hasAnswers(answersForEachQuestion)
      // //create button for that question
      const buttonsCreated = await createButton.createButtonFromQuestionId(
        shuffledKey
      )
      const buttonMessage = await createButton.createButtonMessageWithButtons(
        user.senderID,
        buttonsCreated
      )
      // startedAt = utillArray.getMoment()
      timeOfStart = Date.now()
      messenger.callSendAPI(buttonMessage)

    } else if (user.state.state === 'finish') {
      // get start time of new round
      let timeStartRound = utillArray.getMoment()
      user.setStartRoundTime(timeStartRound)

      let buttonCat = createButton.createButtonCategory(user.senderID)
      messenger.callSendAPI(buttonCat)
    } else if (user.state.state === 'choosing') {
      let buttonCat = await createButton.createButtonCategory(user.senderID)
      messenger.callSendAPI(buttonCat)
    }
  }
}

/**
 * Handle received postback from user
 * @param {object} user
 * @param {object} payloadObj
 * @param {string} timeOfPostback - timestamp
 */
async function handleReceivedPostback(user, payloadObj, timeOfPostback) {
  // let numberOfQuestions = await firebase.getNumberOfQuestions(user.state.category)
  let numberOfQuestions = firebase.getNumberOfQuestions(user.state.category)
  user.hasNumberOfQuestion(numberOfQuestions)

  // check for button nextRound payload
  if (payloadObj.nextRound === true) {
    // analytic
    emitter.emit('nextRound', user)

    let timeStartRound = utillArray.getMoment()
    user.setStartRoundTime(timeStartRound)

    messenger.sendTextMessage(user.senderID, 'Next Round!')
    let buttonCat = await createButton.createButtonCategory(user.senderID)
    messenger.callSendAPI(buttonCat)
  } else if (payloadObj.nextRound === false) {
    // finish
    user.finish()
    messenger.sendTextMessage(user.senderID, "Come back when you're ready~")
    messenger.sendTextMessage(user.senderID, 'Bye Bye <3')
  } else if (payloadObj.nextQuestion === true) {
    // check for button next question
    // call next question
    nextQuestion(user)
  } else if (payloadObj.nextQuestion === false) {
    emitter.emit('pause', user)
    // pause
    user.pause()
    messenger.sendTextMessage(user.senderID, 'Pause <3')
    messenger.sendTextMessage(user.senderID, "Come back when you're ready~")
  }
  // choose category of questions 
  else if (payloadObj.category === '12 factors app') {
    let cat = '12 factors app'
    emitter.emit('category', { user, cat })

    user.playing()
    user.chooseCategory(payloadObj.category)
    messenger.sendTextMessage(user.senderID,`Alright, say 'OK' if you are ready to play`)
  } else if (payloadObj.category === 'design patterns') {
    let cat = 'design patterns'
    emitter.emit('category', { user, cat })

    user.playing()
    user.chooseCategory(payloadObj.category)
    messenger.sendTextMessage(user.senderID,`Alright, say 'OK' if you are ready to play`)
  }
  else if (payloadObj.category === 'rules of thumb') {
    let cat = 'rules of thumb'
    emitter.emit('category', { user, cat })

    user.playing()
    user.chooseCategory(payloadObj.category)
    messenger.sendTextMessage(user.senderID,`Alright, say 'OK' if you are ready to play`)
  } else {
    // Postback for normal questions
    // if in playing question state when receive postback
    // number of questions that user already done increase
    if (user.state.state === 'playing') {
      user.doneQuestion()
    }
    console.log('user after done question= ', user)

    // //check answer and ask next question
    let result = checkAnswer(payloadObj, user.state.answersForEachQuestion)

    // send to calculate grade and score for summary
    let duration = utillArray.calculateDuration(timeOfStart, timeOfPostback)
    let totalScore = summary.calculateTotalScore(user.state.numberOfQuestions)
    let scoreOfThatQuestion = summary.calculateScoreForThatQuestion(
      payloadObj.point,
      result,
      duration
    ) // point for that question
    user.state.userScore += scoreOfThatQuestion
    let grade = summary.calculateGrade(totalScore, user.state.userScore)

    let question = payloadObj.question
    let category = user.state.category
    emitter.emit('answer', { user, result, question, duration, category })

    // // answer Correct
    if (result) {
      messenger.sendTextMessage(user.senderID, 'Correct!')
      let preparedResult = await resultFirebase.prepareResultForFirebase(
        payloadObj,
        user.state.round,
        result,
        timeOfStart,
        timeOfPostback,
        scoreOfThatQuestion,
        user.senderID,
        user.state.category
      )
      firebase.saveResultToFirebase(user.senderID, preparedResult)
    } else {
      // answer Wrong
      messenger.sendTextMessage(user.senderID, 'Wrong!')
      let preparedResult = await resultFirebase.prepareResultForFirebase(
        payloadObj,
        user.state.round,
        result,
        timeOfStart,
        timeOfPostback,
        scoreOfThatQuestion,
        user.senderID,
        user.state.category
      )
      firebase.saveResultToFirebase(user.senderID, preparedResult)
    }

    let keysDone = await firebase.getQuestionDone(
      user.senderID,
      user.state.round,
      user.state.category
    )
    user.removeKeysDone(keysDone)

    // prepare summary object to save in firebase
    if(user.state.numberOfQuestions === user.state.done){
      user.hasKeysLeft(0)
    }
    let preparedSummary = summary.prepareSummary(
      user.state.done,
      user.state.numberOfQuestions,
      user.state.keysLeftForThatUser,
      user.state.round,
      user.state.category,
      grade,
      user.state.userScore,
      totalScore
    )
    firebase.saveSummaryToFirebase(user.senderID, preparedSummary)
    console.log(
      '_______keysLeftForThatUser______ = ',
      user.state.keysLeftForThatUser
    )
    let keysLeftForThatUser = user.state.keysLeftForThatUser

    // ask whether user ready to play next question
    // if there are still questions left that have not done => create next button
    if (typeof keysLeftForThatUser !== 'undefined' && keysLeftForThatUser.length > 0) {
      let buttonNext = await createButton.createButtonNext(user.senderID)
      messenger.callSendAPI(buttonNext)
    } else {
      // if there is no question left that have not done => create next round button
      nextQuestion(user)
    }
  }
}

/**
 * Check if answer correct or wrong
 * @param {object} payload - payload received from postback
 * @param {[String]} answersForEachQuestion
 * @return {Boolean}
 */
function checkAnswer(payload, answersForEachQuestion) {
  // the correct answer is always in first element of answers in json file
  if (payload.answer == answersForEachQuestion[0]) return true
  else return false
}

/**
 * Ask next question
 * @async
 * @param {object} user
 */
async function nextQuestion(user) {
  // let numberOfQuestions = await firebase.getNumberOfQuestions(user.state.category)
  let done = user.state.done

  let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)
  // no question left
  // finish that round
  if (user.state.done === user.state.numberOfQuestions) {
    let grade = await firebase.getGrade(user.senderID, user.state.round)
    messenger.sendTextMessage(user.senderID, 'Finish!')
    messenger.sendTextMessage(user.senderID,
      `You can see the ranking here https://quizchatbot-ce222.firebaseapp.com/`
    )
    //create share button
    const shareButton = await createButton.createButtonShare(user.senderID, user.state.userScore, grade)
    messenger.callSendAPI(shareButton)

    user.finish()
    user.hasKeysLeft(0)

    // for analytics
    let timeFinishedRound = Date.now()
    let roundDuration = utillArray.calculateDuration(
      user.state.timeStartRound,
      timeFinishedRound
    )
    emitter.emit('finish', { user, roundDuration })
    //ask to play next round
    nextRound(user, user.state.numberOfQuestions, done)
  } else {
    // still has questions not answered
    let answersForEachQuestion = await firebase.getAllAnswersFromQuestion(keyOfNextQuestion)
    // no key that matched question
    if (answersForEachQuestion == null) {
      console.log("Doesn't have this id in questions json")
      return null
    }
    user.hasAnswers(answersForEachQuestion)

    let buttonsCreated = await createButton.createButtonFromQuestionId(keyOfNextQuestion)
    let buttonMessage = await createButton.createButtonMessageWithButtons(user.senderID, buttonsCreated)

    timeOfStart = Date.now()

    messenger.callSendAPI(buttonMessage)
  }
}

// remove array from array
// remove questions'keys that already done
// const removeKeysDone = (keys, keysDone) => {
//   utillArray._.pullAll(keys, keysDone)
// }

/**
 * Increase round & ask for next round
 * @param {object} user
 * @param {Number} numberOfQuestions - number of total questions in that category
 * @param {Number} done - number of questions already done
 */
const nextRound = (user, numberOfQuestions, done) => {
  // if number of done questions equals to number of all questions
  // then that round is complete -> round increase
  let round = user.state.round
  if (done === numberOfQuestions) {
    round++
    user.setRound(round)
  }
  // create button ask for next round
  let buttonMessage = createButton.createButtonNextRound(user.senderID)
  messenger.callSendAPI(buttonMessage)
}

/**
 * Start to play next round
 * @param {object} user
 */
const startNextRound = async user => {
  // ready to ask question
  let keysLeftForThatUser = await getKeys()
  user.nextRound(keysLeftForThatUser)

  let shuffledKey = utillArray.shuffleKeyFromQuestions(keysLeftForThatUser)
  let answersForEachQuestion = await firebase.getAllAnswersFromQuestion(
    shuffledKey
  )

  if (answersForEachQuestion == null) {
    console.log("Doesn't have this id in questions database")
    return null
  }
  user.hasAnswers(answersForEachQuestion)

  const buttonsCreated = await createButton.createButtonFromQuestionId(
    shuffledKey
  )
  const buttonMessage = await createButton.createButtonMessageWithButtons(
    user.senderID,
    buttonsCreated
  )
  timeOfStart = Date.now()
  messenger.callSendAPI(buttonMessage)
}

module.exports = {
  app,
  handleReceivedMessage,
  handleReceivedPostback,
  startNextRound,
  nextRound,
  nextQuestion,
  checkAnswer,
  getKeys
}
