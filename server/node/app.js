const app = async () => {
  require('es6-promise').polyfill();
  require('isomorphic-fetch');
  const
    bodyParser = require('body-parser'),
    config = require('config'),
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
    api = require('./localUserAPI')

  // config.serverURL = tunnelConfig.serverURL
  // console.log("config ", config, tunnelConfig)

  let numberOfQuestions = await firebase.getNumberOfQuestions()
  let answerForEachQuestion
  let startedAt
  let skill = "es6"

  async function getKeys() {
    let keys = await firebase.getAllQuestionKeys()
    return keys
  }

  let app = express()
  app.set('port', process.env.PORT || 4000)
  app.set('view engine', 'ejs')
  app.use(bodyParser.json({ extended: false }))
  app.use(express.static('public'))


  // App Secret can be retrieved from the App Dashboard
  const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret')

  // Arbitrary value used to validate a webhook
  const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
    (process.env.MESSENGER_VALIDATION_TOKEN) :
    config.get('validationToken')

  // Generate a page access token for your page from the App Dashboard
  const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
    (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
    config.get('pageAccessToken')

  // URL where the app is running (include protocol). Used to point to scripts and 
  // assets located at this address. 
  const SERVER_URL = (process.env.SERVER_URL) ?
    (process.env.SERVER_URL) :
    config.get('serverURL')

  if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values")
    process.exit(1)
  }

  // get user information from facebook
  const getUserDetail = (senderID) => new Promise(async (resolve, reject) => {
    const graph = `https://graph.facebook.com/v2.9/${senderID}?access_token=${PAGE_ACCESS_TOKEN}`
    fetch(graph)
      .then(async function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        let json = await response.json()
        resolve(json)
      })
      .catch((err) => {
        console.log("Cannot get user information from facebook : ", err)
        reject(err)
      })
  })

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
          // //get state of this user
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
      sendTextMessage(senderID, "Message with attachment received")
    }
  }

  const handleReceivedMessage = async (user, messageText) => {
    //DUPLICATE

    // //first time connect to bot, usersData is empty
    // //let round = 0
    // if (user.state == "initialize") {
    //   //set state in usersData
    //   user.setState({ state, keysLeftForThatUser, "round": 0, done })
    //   console.log("user initialize = ", user)
    // }

    // // //when received welcome will setState again
    // else {
    //   //user has been paused
    //   if (user.state.state == "pause") {
    //     user.setState({ state, keysLeftForThatUser, "round": user.state.round, "done": user.state.done })
    //   }
    //   //user has been paused for next round
    //   else if (user.state.state == "finish") {
    //     user.setState({ "state": "pause", keysLeftForThatUser, "round": user.state.round, "done": 0 })
    //   }
    //   //user has been playing
    //   else {
    //     user.setState({ state, keysLeftForThatUser, "round": user.state.round, "done": user.state.done })
    //     console.log("user playing = ", user)
    //   }
    // }

    if (messageText !== "OK" && user.state.welcomed === true && user.state.state !== "pause" && user.state.state !== "finish") {
      sendTextMessage(user.senderID, "บอกให้พิมพ์ OK ไง เมี๊ยว")
    }
    // //other users except the first user will add their profile to firebase
    else {
      let userDetail = await getUserDetail(user.senderID)
      let firstName = userDetail.first_name
      firebase.saveUserToFirebase(user.senderID, userDetail)

      if (user.state.welcomed === false) {
        user.welcome()
        console.log("user set welcome = ", user)
        user.playing()
        console.log("user set playing = ", user)
        //sendLetsQuiz(user.senderID, messageText, firstName)
        sendTextMessage(user.senderID, `Welcome to QuizBot! ${firstName}` + "\n" + `say 'OK' if you want to play`)
      }

      // //already quiz with chatbot or user come back after pause
      else if (user.state.state === "playing" || user.state.state === "pause" || user.state.state === "finish") {
        console.log("playing")
        console.log("user playing = ", user)
        //get keys question that user done
        let keysDone = await firebase.getQuestionDone(user.senderID, user.state.round)

        //remove questions done from questions that not yet answered
        removeKeysDone(user.state.keysLeftForThatUser, keysDone)


        //if user pause -> change to playing
        if (user.state.state === "pause") {
          console.log("_________PAUSE__________")
          user.resume()
          console.log("user after resume = ", user)
        }
        else if (user.state.state === "finish") {
          let keysLeftForThatUser = await getKeys()
          user.startAgain(keysLeftForThatUser)
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
        callSendAPI(buttonMessage)

      }
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

  async function handleReceivedPostback(user, payloadObj, timeOfPostback) {
    //check for button nextRound payload
    if (payloadObj.nextRound === true) {
      sendTextMessage(user.senderID, "Next Round!")
      startNextRound(user)
    }
    else if (payloadObj.nextRound === false) {
      //pause finish
      user.finish()
      sendTextMessage(user.senderID, "Come back when you're ready baby~")
      sendTextMessage(user.senderID, "Bye Bye <3")
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
      sendTextMessage(user.senderID, "Hell <3")
      sendTextMessage(user.senderID, "Come back when you're ready baby~")
    }

    //Postback for normal questions
    else {
      //if in playing question state when receive postback 
      //number of questions that user already done increase
      if (user.state.state === "playing") {
        user.state.done++
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
        sendTextMessage(user.senderID, "Good dog!")
        let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
          result, startedAt, timeOfPostback, scoreOfThatQuestion, user.senderID)
        firebase.saveResultToFirebase(user.senderID, preparedResult)
      }
      //answer Wrong
      else {
        sendTextMessage(user.senderID, "Bad dog!")
        let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
          result, startedAt, timeOfPostback, scoreOfThatQuestion, user.senderID)
        firebase.saveResultToFirebase(user.senderID, preparedResult)
      }

      let keysDone = await firebase.getQuestionDone(user.senderID, user.state.round)
      removeKeysDone(user.state.keysLeftForThatUser, keysDone)
      console.log("user after remove keys done = ", user)
      console.log("score = ", user.state.userScore)
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
        callSendAPI(buttonNext)
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
    let done = user.state.done
    console.log("user next q = ", user)
    let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)
    //no question left
    //finish that round
    if (keyOfNextQuestion == null) {
      let grade = await firebase.getGrade(user.senderID, user.state.round)
      sendTextMessage(user.senderID, "Finish!")
      sendTextMessage(user.senderID, `ได้คะแนน ${user.state.userScore} เกรด ${grade} ถ้าอยากรู้ลำดับก็ไปที่ https://quizchatbot-ce222.firebaseapp.com/ เลยย`)
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

      callSendAPI(buttonMessage)
    }
  }

  //remove array from array
  //remove questions'keys that already done 
  const removeKeysDone = (keys, keysDone) => {
    utillArray._.pullAll(keys, keysDone)
  }
 
  const nextRound = (user, numberOfQuestions, done) => {
    //if number of done questions equals to number of all questions
    //then that round is complete -> round increase 
    let round = user.state.round
    console.log("user test nextRound = ", user)
     console.log("numberOfQuestions = ", numberOfQuestions)
      console.log("done = ", user.state.done)
    console.log("round = ", round)
    if (done === numberOfQuestions) {
      round++
      console.log("round increase = ", round)
      user.setRound(round)
       console.log("user set round = ", user)
    }
    //create button ask for next round
    let buttonMessage = createButton.createButtonNextRound(user.senderID)
    callSendAPI(buttonMessage)
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
    callSendAPI(buttonMessage)
  }

  /*
   * Send a text message using the Send API.
   *
   */
  function sendTextMessage(recipientId, messageText) {
    let messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    }

    callSendAPI(messageData)
  }


  /*
   * Call the Send API. The message data goes in the body. If successful, we'll 
   * get the message id in a response 
   *
   */
  function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let recipientId = body.recipient_id
          let messageId = body.message_id

          if (messageId) {
            console.log("Successfully sent message with id %s to recipient %s",
              messageId, recipientId)
          } else {
            console.log("Successfully called Send API for recipient %s",
              recipientId)
          }
        } else {
          console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
      });
  }


  //Greeting message
  function setGreetingText() {
    let greetingData = {
      setting_type: "greeting",
      greeting: {
        text: "Welcome to QuizChatbot!"
      }
    };
    createGreetingApi(greetingData)
  }

  function createGreetingApi(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log("Greeting set successfully!")
        } else {
          console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
        }
      })
  }


  async function sendLetsQuiz(recipientId, messageText, firstName) {
    let messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "Welcome to Quizbot! " + firstName,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    }
    callSendAPI(messageData)
  }


  // Start server
  // Webhooks must be available via SSL with a certificate signed by a valid 
  // certificate authority.
  app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
    setGreetingText()
  })
}

module.exports = app

