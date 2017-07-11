require('es6-promise').polyfill();
require('isomorphic-fetch');

const
  bodyParser = require('body-parser'),
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
  config = require('./config')


let APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL

  APP_SECRET = config.APP_SECRET 
  VALIDATION_TOKEN = config.VALIDATION_TOKEN
  PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN
  SERVER_URL = config.SERVER_URL


const app = async () => {

  // config.serverURL = tunnelConfig.serverURL
  // console.log("config ", config, tunnelConfig)

  let app = express()
  app.set('port', process.env.PORT || 4000)
  app.set('view engine', 'ejs')
  app.use(bodyParser.json({ extended: false }))
  app.use(express.static('public'))

  app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
      console.log("Validating webhook")
      res.status(200).send(req.query['hub.challenge'])
    } else {
      console.error("Failed validation. Make sure the validation tokens match.")

      res.sendStatus(403)
    }
  });


  //occur when user send something to bot
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
          console.log("recieve mssg read")
          console.log("mssg.read ", messagingEvent.read)
          console.log("receive mssg")

          //get all question keys and save to usersData for that senderID
          let keysLeftForThatUser = await getKeys()
          // get user if doesn't have this user before
          let user = await userClass.load(messagingEvent.sender.id, keysLeftForThatUser, api)


          if (messagingEvent.optin) {
            receivedAuthentication(messagingEvent)
          } else if (messagingEvent.message) {
            receivedMessage(messagingEvent, user)
          } else if (messagingEvent.delivery) {
            receivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.postback) {
            receivedPostback(messagingEvent, user)
          } else if (messagingEvent.read) {
            receivedMessageRead(messagingEvent)
          } else if (messagingEvent.account_linking) {
            receivedAccountLink(messagingEvent)
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent)
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've 
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200)
    }
  });

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
  async function receivedMessage(event, user) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message

    console.log("Received message for user %d and page %d at %d with message:",
      senderID, recipientID, timeOfMessage)
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
      messenger.sendTextMessage(senderID, "Message with attachment received")
    }
  }

  /*
   * Postback Event
   *
   * This event is called when a postback is tapped on a Structured Message. 
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
   * 
   */
  async function receivedPostback(event, user) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfPostback = event.timestamp
    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    let payload = event.postback.payload
    let payloadObj = JSON.parse(payload)
    console.log("Received postback for user %d and page %d with payload '%s' " +
      "at %d", senderID, recipientID, payload, timeOfPostback)

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



// let numberOfQuestions = await firebase.getNumberOfQuestions()
let answerForEachQuestion
let startedAt
let skill = "es6"


async function getKeys() {
  let keys = await firebase.getAllQuestionKeys()
  return keys
}


const handleReceivedMessage = async (user, messageText) => {
  if (messageText !== "OK" && user.state.welcomed === true && user.state.state !== "pause" && user.state.state !== "finish") {
    messenger.sendTextMessage(user.senderID, "บอกให้พิมพ์ OK ไง เมี๊ยว")
  }
  // //other users except the first user will add their profile to firebase
  else {
    let userDetail = await messenger.getUserDetail(user.senderID)
    let firstName = userDetail.first_name
    firebase.saveUserToFirebase(user.senderID, userDetail)

    if (user.state.welcomed === false) {
      user.welcome()
      console.log("user set welcome = ", user)
      user.playing()
      console.log("user set playing = ", user)
      //sendLetsQuiz(user.senderID, messageText, firstName)
      messenger.sendTextMessage(user.senderID, `Welcome to QuizBot! ${firstName}` + "\n" + `say 'OK' if you want to play`)
    }

    // //already quiz with chatbot or user come back after pause
    else if (user.state.state === "playing" || user.state.state === "pause" || user.state.state === "finish") {
      console.log("playing")
      console.log("user playing = ", user)
      //get keys question that user done
      let keysDone = await firebase.getQuestionDone(user.senderID, user.state.round)

      //remove questions done from questions that not yet answered
      user.removeKeysDone(keysDone)


      //if user pause -> change to playing
      if (user.state.state === "pause") {
        console.log("_________PAUSE__________")
        user.resume()
        console.log("user after resume = ", user)
      }
      else if (user.state.state === "finish") {
        let keysLeftForThatUser = await getKeys()
        user.nextRound(keysLeftForThatUser)
        console.log("user after finish = ", user)
      }

      // //shuffle keys of questions that have not answered
      let shuffledKey = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)
      user.startQuiz(shuffledKey)
      console.log("user start quiz = ", user)
      answerForEachQuestion = await firebase.getAllAnswersFromQuestion(shuffledKey)
      if (answerForEachQuestion == null) {
        console.log("Doesn't have this id in questions database")
        return null
      }
      // //create button for that question
      const buttonsCreated = await createButton.createButtonFromQuestionId(shuffledKey)
      const buttonMessage = await createButton.createButtonMessageWithButtons(user.senderID, buttonsCreated)
      startedAt = utillArray.getMoment()
      messenger.callSendAPI(buttonMessage)

    }
  }
}


async function handleReceivedPostback(user, payloadObj, timeOfPostback) {
  let numberOfQuestions = await firebase.getNumberOfQuestions()
  console.log("_____pay = ", payloadObj)

  //check for button nextRound payload
  if (payloadObj.nextRound === true) {
    messenger.sendTextMessage(user.senderID, "Next Round!")
    startNextRound(user)
  }
  else if (payloadObj.nextRound === false) {
    //pause finish
    user.finish()
    messenger.sendTextMessage(user.senderID, "Come back when you're ready baby~")
    messenger.sendTextMessage(user.senderID, "Bye Bye <3")
  }

  //check for button next question
  else if (payloadObj.nextQuestion === true) {
    //call next question
    nextQuestion(user)
  }
  else if (payloadObj.nextQuestion === false) {
    //pause
    user.pause()
    console.log("user after pause = ", user)
    messenger.sendTextMessage(user.senderID, "Hell <3")
    messenger.sendTextMessage(user.senderID, "Come back when you're ready baby~")
  }

  //Postback for normal questions
  else {
    //if in playing question state when receive postback 
    //number of questions that user already done increase
    if (user.state.state === "playing") {
      user.doneQuestion()
    }
    console.log("user after done question= ", user)

    // //check answer and ask next question
    let result = checkAnswer(payloadObj, answerForEachQuestion)

    //send to calculate grade and score for summary
    let duration = utillArray.calculateDuration(startedAt, timeOfPostback)
    let totalScore = summary.calculateTotalScore(numberOfQuestions)
    let scoreOfThatQuestion = summary.calculateScoreForThatQuestion(payloadObj.point, result, duration) //point for that question 
    user.state.userScore += scoreOfThatQuestion
    let grade = summary.calculateGrade(totalScore, user.state.userScore)

    // // answer Correct
    if (result) {
      messenger.sendTextMessage(user.senderID, "Good dog!")
      let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
        result, startedAt, timeOfPostback, scoreOfThatQuestion, user.senderID)
      firebase.saveResultToFirebase(user.senderID, preparedResult)
    }
    //answer Wrong
    else {
      messenger.sendTextMessage(user.senderID, "Bad dog!")
      let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
        result, startedAt, timeOfPostback, scoreOfThatQuestion, user.senderID)
      firebase.saveResultToFirebase(user.senderID, preparedResult)
    }

    let keysDone = await firebase.getQuestionDone(user.senderID, user.state.round)
    user.removeKeysDone(keysDone)
    //prepare summary object to save in firebase
    let preparedSummary = summary.prepareSummary(user.state.done, numberOfQuestions, user.state.keysLeftForThatUser,
      user.state.round, skill, grade, user.state.userScore, totalScore)
    firebase.saveSummaryToFirebase(user.senderID, preparedSummary)
    console.log("_______keysLeftForThatUser______ = ", user.state.keysLeftForThatUser)
    let keysLeftForThatUser = user.state.keysLeftForThatUser


    //ask whether user ready to play next question 
    //if there are still questions left that have not done => create next button
    if (typeof keysLeftForThatUser !== 'undefined' && keysLeftForThatUser.length > 0) {
      let buttonNext = await createButton.createButtonNext(user.senderID)
      messenger.callSendAPI(buttonNext)
    }
    //if there is no question left that have not done => create next round button
    else {
      nextQuestion(user)
    }
  }
}

function checkAnswer(payload, answerForEachQuestion) {
  //the correct answer is always in first element of answers in json file
  if (payload.answer == answerForEachQuestion[0]) return true
  else return false

}

async function nextQuestion(user) {
  let numberOfQuestions = await firebase.getNumberOfQuestions()
  let done = user.state.done
  console.log("user next q = ", user)
  let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)
  //no question left
  //finish that round
  if (keyOfNextQuestion == null) {
    let grade = await firebase.getGrade(user.senderID, user.state.round)
    messenger.sendTextMessage(user.senderID, "Finish!")
    messenger.sendTextMessage(user.senderID, `ได้คะแนน ${user.state.userScore} เกรด ${grade} ถ้าอยากรู้ลำดับก็ไปที่ https://quizchatbot-ce222.firebaseapp.com/ เลยย`)
    user.finish()
    nextRound(user, numberOfQuestions, done)
  }

  //still has questions not answered
  else {
    answerForEachQuestion = await firebase.getAllAnswersFromQuestion(keyOfNextQuestion)
    //no key that matched question
    if (answerForEachQuestion == null) {
      console.log("Doesn't have this id in questions json")
      return null
    }

    let buttonsCreated = await createButton.createButtonFromQuestionId(keyOfNextQuestion)
    let buttonMessage = await createButton.createButtonMessageWithButtons(user.senderID, buttonsCreated)

    startedAt = utillArray.getMoment()

    messenger.callSendAPI(buttonMessage)
  }
}

//remove array from array
//remove questions'keys that already done 
// const removeKeysDone = (keys, keysDone) => {
//   utillArray._.pullAll(keys, keysDone)
// }

const nextRound = (user, numberOfQuestions, done) => {
  //if number of done questions equals to number of all questions
  //then that round is complete -> round increase 
  let round = user.state.round
  if (done === numberOfQuestions) {
    round++
    user.setRound(round)
  }
  //create button ask for next round
  let buttonMessage = createButton.createButtonNextRound(user.senderID)
  messenger.callSendAPI(buttonMessage)
}

const startNextRound = async (user) => {
  //ready to ask question
  let keysLeftForThatUser = await getKeys()
  user.nextRound(keysLeftForThatUser)
  console.log("keysLeft = ", keysLeftForThatUser)
  console.log("user next round = ", user)

  let shuffledKey = utillArray.shuffleKeyFromQuestions(keysLeftForThatUser)
  // currentQuestionKey = shuffledKey
  answerForEachQuestion = await firebase.getAllAnswersFromQuestion(shuffledKey)

  if (answerForEachQuestion == null) {
    console.log("Doesn't have this id in questions database")
    return null
  }

  const buttonsCreated = await createButton.createButtonFromQuestionId(shuffledKey)
  const buttonMessage = await createButton.createButtonMessageWithButtons(user.senderID, buttonsCreated)
  startedAt = utillArray.getMoment()
  messenger.callSendAPI(buttonMessage)
}


module.exports = {
  app, handleReceivedMessage, handleReceivedPostback,
  startNextRound, nextRound, nextQuestion, checkAnswer, getKeys
}

