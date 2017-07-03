
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
    resultFirebase = require('./result')

  // config.serverURL = tunnelConfig.serverURL
  // console.log("config ", config, tunnelConfig)
  let u1 = await userClass.load('1475112222554339')
  console.log("u1 = ", u1)

  let numberOfQuestions = await firebase.getNumberOfQuestions()
  let user
  let results
  let answerForEachQuestion
  let currentQuestionKey
  let startedAt
  let round = 0
  let done = 0
  let skill = "es6"
  let userScore = 0
  let usersData = {} //keep users sessions
  let usersWelcome = {} //keep welcome states for that user only
  
  // async function setState(userId, state) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     usersData[userId] = { state }
  //   } else {
  //     usersData[userId] = state
  //   }
  //   console.log('userData = ', usersData)
  // }

  // async function setRound(userId, round) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     usersData[userId] = { round }
  //   } else {
  //     usersData[userId].round = round
  //   }
  // }

  // async function getState(userId) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     return "initialize"
  //   } else {
  //     return usersData[userId]
  //   }
  // }

  // async function getKeysLeftForThatUser(userId) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     return "User answered all questions"
  //   } else {
  //     return usersData[userId].keysLeftForThatUser
  //   }
  // }

  // async function getDoneFromThatUser(userId) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     return "Initialize"
  //   } else {
  //     return usersData[userId].done
  //   }
  // }

  // async function getRoundFromThatUser(userId) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     return "Initialize"
  //   } else {
  //     return usersData[userId].round
  //   }
  // }

  // async function getReceivedWelcomeFromThatUser(userId) {
  //   if (!usersData.hasOwnProperty(userId).hasOwnProperty(receivedWelcome)) {
  //     return "Initialize"
  //   } else {
  //     return usersData[userId].receivedWelcome
  //   }
  // }

  // async function setReceivedWelcome(userId, receivedWelcome) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     usersData[userId] = { receivedWelcome }
  //   } else {
  //     usersData[userId].receivedWelcome = receivedWelcome
  //   }
  // }

  // async function setStateWelcome(userId, welcome) {
  //   if (!usersData.hasOwnProperty(userId)) {
  //     usersWelcome[userId] = { welcome }
  //   } else {
  //     usersWelcome[userId] = welcome
  //   }
  //   console.log('setStateWelcome = ', usersWelcome)
  // }

  // async function getStateWelcome(userId) {
  //   if (!usersWelcome.hasOwnProperty(userId)) {
  //     return false
  //   } else {
  //     return usersWelcome[userId]
  //   }
  // }

  async function getKeys() {
    let keys = await firebase.getAllQuestionKeys()
    return keys
  }
  // const getUserPSID = (senderID) => new Promise(async (resolve) => {
  //   const accountLinkingToken = "ART0rGA7_DePruzCsC6LWtN5Oapr5pt5DFFVHtsqsiyRkFsmUCqgkvVuFsDAoosdjhwSBgXOpSNtPnKxIPOEQvM6mKDwu7P2IStBlAIbIfLp1w"
  //   const pageAccessToken = 'EAADz9MihTvcBAIytXu2dASyZACO3IFrx2v5YQYjNBnZAXsgxohA3P0FUbQ87EAi7ojJLdqQiQ4VCZCTWe1ctTdKUabE2hLRbJ5yFMfPzjaQrRtpWgnVktLjOExjjTQdW5SZCZA1imL83x6iBECIkacm8IE6Tnwf4veTNvKuZCa8wZDZD'
  //   const graph = `https://graph.facebook.com/v2.9/me?access_token=${pageAccessToken}\&fields=recipient\&account_linking_token=${accountLinkingToken}`
  //   console.log("graph user PSID = ", graph);
  //   fetch(graph)
  //     .then(async function (response) {
  //       if (response.status >= 400) {
  //         throw new Error("Bad response from server");
  //       }
  //       let result = await response.json();
  //       console.log("response psid = ", result);
  //       resolve(result)
  //     })

  // })



  let app = express()
  app.set('port', process.env.PORT || 4000)
  app.set('view engine', 'ejs')
  app.use(bodyParser.json({ extended: false }))
  app.use(express.static('public'))


  let state = "initial"


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
        pageEntry.messaging.forEach(messagingEvent => {
          console.log("recieve mssg read")
          console.log("mssg.read ", messagingEvent.read)
          console.log("receive mssg")
          //console.log(messagingEvent.message.text)


          if (messagingEvent.optin) {
            receivedAuthentication(messagingEvent)
          } else if (messagingEvent.message) {
            receivedMessage(messagingEvent)
          } else if (messagingEvent.delivery) {
            receivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.postback) {
            receivedPostback(messagingEvent)
          } else if (messagingEvent.read) {
            receivedMessageRead(messagingEvent)
          } else if (messagingEvent.account_linking) {
            receivedAccountLink(messagingEvent)
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
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
  async function receivedMessage(event) {
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

    if (isEcho) {
      // Just logging message echoes to console
      console.log("Received echo for message %s and app %d with metadata %s",
        messageId, appId, metadata)
      return
    } else if (quickReply) {
      let quickReplyPayload = quickReply.payload;
      console.log("Quick reply for mesage %s with payload %s",
        messageId, quickReplyPayload)

      sendTextMessage(senderID, "Quick reply tapped");
      return
    }

    if (messageText) {
      //get all question keys and save to usersData for that senderID
      // let keysLeftForThatUser = await getKeys()

      // //get state of this user
      // let userState = await getState(senderID)
      // console.log("user state = ", userState)

      // //first time connect to bot, usersData is empty
      // //let round = 0
      // if (userState == "initialize") {
      //   //set state in usersData
      //   setState(senderID, { state, keysLeftForThatUser, "round": 0, done })
      //   //get state of the user
      //   userState = await getState(senderID)
      // }

      // //when received welcome will setState again
      // else {
      //   let tmpRound = await getState(senderID)
      //   console.log("______state in else_________ = ", tmpRound)
      //   let tmpDone = await getDoneFromThatUser(senderID)
      //   console.log("______done in else_________ = ", tmpDone)
      //   //user has been paused
      //   if (tmpRound.state == "pause") setState(senderID, { state, keysLeftForThatUser, "round": tmpRound.round, "done": tmpDone })
      //   //user has been paused for next round
      //   else if (tmpRound.state == "finish") {
      //     console.log("______state finish_________ = ")
      //     tmpDone = 0
      //     setState(senderID, { "state": "pause", keysLeftForThatUser, "round": tmpRound.round, "done": tmpDone })
      //   }
      //   //user has been playing
      //   else setState(senderID, { state, keysLeftForThatUser, "round": tmpRound.state.round, "done": tmpDone })
      //   userState = await getState(senderID)
      // }

      // //other users except the first user will add their profile to firebase
      // let userDetail = await getUserDetail(senderID)
      // user = userDetail
      // let firstName = user.first_name

      // let tmpReceivedWelcome = await getStateWelcome(senderID)
      // firebase.saveUserToFirebase(senderID, user)

      // console.log("______UsersData______ = ", usersData)
      // for (let userId in usersData) {
      //   if (userId == senderID && !tmpReceivedWelcome) {
      //     tmpReceivedWelcome = true
      //     setStateWelcome(senderID, tmpReceivedWelcome)
      //     console.log("UsersData receive welcome = ", usersData)
      //     sendLetsQuiz(senderID, messageText, firstName)
      //   }
      // }


      // //user chat with bot for the first time
      // if (userState.state.state === "initial") {
      //   // if (!user) {
      //   //   let userDetail = await getUserDetail(senderID)
      //   //   user = userDetail
      //   // }
      //   // let firstName = user.first_name
      //   // //sendLetsQuiz(senderID, messageText, firstName)
      //   // firebase.saveUserToFirebase(senderID, user)
      // }

      // //when set state again, data format will change
      // //already quiz with chatbot or user come back after pause
      // else if (userState.state === "playing" || userState.state === "pause") {

      //   let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
      //   console.log("keysLeftForThatUser in receivedMessage= ", keysLeftForThatUser)

      //   //get keys question that user done
      //   let tmpRound = await getRoundFromThatUser(senderID)
      //   let keysDone = await firebase.getQuestionDone(senderID, tmpRound)
      //   let test = await getState(senderID)
      //   console.log("keyDone1 = ", keysDone)
      //   console.log("test in pause/play = ", test)

      //   //remove questions done from questions that not yet answered
      //   removeKeysDone(keysLeftForThatUser, keysDone)
      //   console.log("key left1 after remove= ", keysLeftForThatUser)

      //   //if user pause -> change to playing
      //   if (userState.state === "pause") {
      //     console.log("_________PAUSE__________")
      //     let tmpDone = await getDoneFromThatUser(senderID)
      //     let tmpRound = await getRoundFromThatUser(senderID)
      //     console.log("tmpRound after pause= ", tmpRound)
      //     setState(senderID, { "state": "playing", keysLeftForThatUser, "round": tmpRound, "done": tmpDone })
      //   }
      //   //if user playing
      //   else {
      //     setState(senderID, { state, keysLeftForThatUser, "round": tmpRound, done })
      //   }
      //   console.log("userData2 = ", usersData)

      //   //shuffle keys of questions that have not answered
      //   let shuffledKey = utillArray.shuffleKeyFromQuestions(keysLeftForThatUser)
      //   currentQuestionKey = shuffledKey
      //   answerForEachQuestion = await firebase.getAllAnswersFromQuestion(shuffledKey)
      //   if (answerForEachQuestion == null) {
      //     console.log("Doesn't have this id in questions database")
      //     return null
      //   }

      //   //create button for that question
      //   const buttonsCreated = await createButton.createButtonFromQuestionId(shuffledKey)
      //   const buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)
      //   startedAt = utillArray.getMoment()
      //   callSendAPI(buttonMessage)
      // }



      //TOFIX : Code review , use User and Question class

      //get all question keys and save to usersData for that senderID
      let keysLeftForThatUser = await getKeys()
      // //get state of this user
      user = await userClass.load(senderID)

      // //first time connect to bot, usersData is empty
      // //let round = 0
      if (user.state == "initialize") {
        //set state in usersData
        user.setState({ state, keysLeftForThatUser, "round": 0, done })
        console.log("user initialize = ", user)
      }

      // //when received welcome will setState again
      else {
        //user has been paused
        if (user.state.state == "pause") {
          user.setState({ state, keysLeftForThatUser, "round": user.state.round, "done": user.state.done })
        }
        //user has been paused for next round
        else if (user.state.state == "finish") {
          user.setState({ "state": "pause", keysLeftForThatUser, "round": user.state.round, "done": 0 })
        }
        //user has been playing
        else {
          user.setState({ state, keysLeftForThatUser, "round": user.state.round, "done": user.state.done })
          console.log("user playing = ", user)
        }
      }

      // //other users except the first user will add their profile to firebase
      let userDetail = await getUserDetail(senderID)
      let firstName = userDetail.first_name

      let tmpReceivedWelcome = await user.getWelcome()
      console.log("tmpReceivedWelcome = ", tmpReceivedWelcome)
      firebase.saveUserToFirebase(senderID, userDetail)

      if (!tmpReceivedWelcome) {
        tmpReceivedWelcome = true
        user.setStateWelcome(tmpReceivedWelcome)
        console.log("user after welcome = ", user)
        sendLetsQuiz(senderID, messageText, firstName)
      }


      // //when set state again, data format will change
      // //already quiz with chatbot or user come back after pause
      else if (user.state.state === "playing" || user.state.state === "pause") {

        // let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
    

        //get keys question that user done
        let keysDone = await firebase.getQuestionDone(senderID, user.state.round)

        //remove questions done from questions that not yet answered
        removeKeysDone(user.state.keysLeftForThatUser, keysDone)


        //if user pause -> change to playing
        if (user.state.state === "pause") {
          console.log("_________PAUSE__________")
          setState(senderID, { "state": "playing", "keysLeftForThatUser" : user.state.keysLeftForThatUser, "round": user.state.round, "done": user.state.done })
        }
        //if user playing
        else {
          console.log("playing")
          console.log(user)
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
        const buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)
        startedAt = utillArray.getMoment()
        callSendAPI(buttonMessage)

      }
    } else if (messageAttachments) {
      sendTextMessage(senderID, "Message with attachment received")
    }
  }


  /*
   * Postback Event
   *
   * This event is called when a postback is tapped on a Structured Message. 
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
   * 
   */
  async function receivedPostback(event) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfPostback = event.timestamp

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    let payload = event.postback.payload
    let payloadObj = JSON.parse(payload)
    console.log("payloadOBJ = ", payloadObj)
    console.log("Received postback for user %d and page %d with payload '%s' " +
      "at %d", senderID, recipientID, payload, timeOfPostback)

    //check for button nextRound payload
    if (payloadObj.nextRound === true) {
      sendTextMessage(senderID, "Next Round!")
      startNextRound(senderID, user.state.round)
    }
    else if (payloadObj.nextRound === false) {
        //pause
      setState({ "keysLeftForThatUser": user.state.keysLeftForThatUser, "state": "finish", "done": user.state.done, "round": user.state.round })
      sendTextMessage(senderID, "Come back when you're ready baby~")
      sendTextMessage(senderID, "Bye Bye <3")
    }

    //check for button next question
    else if (payloadObj.nextQuestion === true) {
      //call next question
      nextQuestion(senderID)
    }
    else if (payloadObj.nextQuestion === false) {
      //pause
      state = "pause"
      user.setState({ state, "keysLeftForThatUser": user.state.keysLeftForThatUser, "done": user.state.done, "round": user.state.round })
      sendTextMessage(senderID, "Hell <3")
      sendTextMessage(senderID, "Come back when you're ready baby~")
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
      userScore += scoreOfThatQuestion
      let grade = summary.calculateGrade(totalScore, userScore)

      // // answer Correct
      if (result) {
        sendTextMessage(senderID, "Good dog!")
        let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
                                      result, startedAt,timeOfPostback, scoreOfThatQuestion, senderID)
        firebase.saveResultToFirebase(senderID, preparedResult)
      }
      //answer Wrong
      else {
        sendTextMessage(senderID, "Bad dog!")
        let preparedResult = await resultFirebase.prepareResultForFirebase(payloadObj, answerForEachQuestion, user.state.round,
                                      result, startedAt, timeOfPostback, scoreOfThatQuestion, senderID)
        firebase.saveResultToFirebase(senderID, preparedResult)
      }

      let keysDone = await firebase.getQuestionDone(senderID, user.state.round)
      removeKeysDone(user.state.keysLeftForThatUser, keysDone)
      user.setState({
        "state": "playing", "keysLeftForThatUser": user.state.keysLeftForThatUser, "round": user.state.round,
        "done": user.state.done
      })



      //prepare summary object to save in firebase
      let preparedSummary = summary.prepareSummary(user.state.done, numberOfQuestions, user.state.keysLeftForThatUser,
        user.state.round, skill, grade, userScore, totalScore)
      firebase.saveSummaryToFirebase(senderID, preparedSummary)
      console.log("_______keysLeftForThatUser______ = ", user.state.keysLeftForThatUser)
      let keysLeftForThatUser = user.state.keysLeftForThatUser


      //ask whether user ready to play next question 
      //if there are still questions left that have not done => create next button
      if (typeof keysLeftForThatUser !== 'undefined' && keysLeftForThatUser.length > 0) {
        let buttonNext = await createButton.createButtonNext(senderID)
        callSendAPI(buttonNext)
      }
      //if there is no question left that have not done => create next round button
      else {
        nextQuestion(senderID)
      }



      //Original


      // //if in question state when receive postback done = done +1 
      // //number of question user answered incresae 
      // let postbackState = await getState(senderID)
      // console.log("post back getState= ", postbackState.state)

      // //number of questions that user already done increase
      // let tmpDone = await getDoneFromThatUser(senderID)
      // console.log("post back tmpDone= ", tmpDone)
      // if (postbackState.state === "playing") tmpDone++
      // console.log("post back tmpDone after increase= ", tmpDone)


      // //check answer and ask next question
      // let result = checkAnswer(payload, answerForEachQuestion)

      // //send to calculate grade and score for summary
      // let duration = utillArray.calculateDuration(startedAt, timeOfPostback)
      // let totalScore = summary.calculateTotalScore(numberOfQuestions)
      // let scoreOfThatQuestion = summary.calculateScoreForThatQuestion(JSON.parse(payload).point, result, duration) //point for that question 
      // userScore += scoreOfThatQuestion
      // let grade = summary.calculateGrade(totalScore, userScore)


      // // answer Correct
      // if (result) {
      //   sendTextMessage(senderID, "Good dog!")
      //   let preparedResult = await prepareResultForFirebase(payload, answerForEachQuestion, result, startedAt,
      //     timeOfPostback, scoreOfThatQuestion, senderID)
      //   firebase.saveResultToFirebase(senderID, preparedResult)
      // }
      // //answer Wrong
      // else {
      //   sendTextMessage(senderID, "Bad dog!")
      //   let preparedResult = await prepareResultForFirebase(payload, answerForEachQuestion, result, startedAt,
      //     timeOfPostback, scoreOfThatQuestion, senderID)
      //   firebase.saveResultToFirebase(senderID, preparedResult)
      // }



      // //keys = removeKeyThatAsked(currentQuestionKey)
      // let tmpRound = await getRoundFromThatUser(senderID)
      // let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
      // console.log("key left2= ", keysLeftForThatUser)
      // let keysDone = await firebase.getQuestionDone(senderID, tmpRound)
      // console.log("keyDone2 = ", keysDone)
      // removeKeysDone(keysLeftForThatUser, keysDone)
      // console.log("key left2 after remove= ", keysLeftForThatUser)
      // setState(senderID, { "state": "playing", keysLeftForThatUser, "round": tmpRound, "done": tmpDone })
      // console.log("userData4 = ", usersData)



      // //prepare summary object to save in firebase
      // tmpDone = await getDoneFromThatUser(senderID)
      // let preparedSummary = summary.prepareSummary(tmpDone, numberOfQuestions, keysLeftForThatUser, tmpRound, skill, grade, userScore, totalScore)
      // console.log("summary = ", preparedSummary)
      // firebase.saveSummaryToFirebase(senderID, preparedSummary)
      // console.log("_______keysLeftForThatUser______ = ", keysLeftForThatUser)



      // //ask whether user ready to play next question 
      // //if there are still questions left that have not done => create next button
      // if (typeof keysLeftForThatUser !== 'undefined' && keysLeftForThatUser.length > 0) {
      //   let buttonNext = await createButton.createButtonNext(senderID)
      //   callSendAPI(buttonNext)
      // }
      // //if there is no question left that have not done => create next round button
      // else {
      //   nextQuestion(senderID)
      // }
    }

  }

  function checkAnswer(payload, answerForEachQuestion) {
    //the correct answer is always in first element of answers in json file
    if (payload.answer == answerForEachQuestion[0]) return true
    else return false

  }

  async function nextQuestion(senderID) {
    // let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
    // console.log("keysLeftForThatUser in nextQuestion after delete = ", keysLeftForThatUser)
    // let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(keysLeftForThatUser)

    // //define current key = key of question about to ask
    // currentQuestionKey = keyOfNextQuestion
    // console.log("keyOfNextQuestion in nextQuestion = ", keyOfNextQuestion)

    // //no question left
    // //finish that round
    // if (keyOfNextQuestion == null) {
    //   sendTextMessage(senderID, "Finish!")
    //   state = "finish"

    //   let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
    //   let tmpRound = await getRoundFromThatUser(senderID)
    //   let tmpDone = await getDoneFromThatUser(senderID)
    //   setState(senderID, { state, keysLeftForThatUser, "round": tmpRound, "done": tmpDone })
    //   console.log("set state after = ", usersData)
    //   done = 0
    //   userScore = 0

    //   nextRound(senderID, tmpRound, tmpDone, numberOfQuestions)
    // }

    // //still has questions not answered
    // else {

    //   answerForEachQuestion = await firebase.getAllAnswersFromQuestion(keyOfNextQuestion)

    //   //no key that matched question
    //   if (answerForEachQuestion == null) {
    //     console.log("Doesn't have this id in questions json")
    //     return null
    //   }

    //   let buttonsCreated = await createButton.createButtonFromQuestionId(keyOfNextQuestion)
    //   let buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)

    //   startedAt = utillArray.getMoment()

    //   callSendAPI(buttonMessage)
    // }




    //TOFIX: user class
    let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)

    //define current key = key of question about to ask
    currentQuestionKey = keyOfNextQuestion

    //no question left
    //finish that round
    if (keyOfNextQuestion == null) {
      sendTextMessage(senderID, "Finish!")
      state = "finish"
      user.setState({ state, "keysLeftForThatUser": user.state.keysLeftForThatUser, "round": user.state.round, "done": user.state.done })

      done = 0
      userScore = 0

      nextRound(senderID, user.state.round, user.state.done, numberOfQuestions)
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
      let buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)

      startedAt = utillArray.getMoment()

      callSendAPI(buttonMessage)
    }
  }

  //delete key of question that already asked
  function removeKeyThatAsked(currentQuestionKey) {
    utillArray._.remove(keys, function (key) {
      return key === currentQuestionKey
    })
    return keys
  }

  //remove array from array
  const removeKeysDone = (keys, keysDone) => {
    utillArray._.pullAll(keys, keysDone)
  }

  const nextRound = (senderID, round, done, numberOfQuestions) => {
    //if number of done questions equals to number of all questions
    //then that round is complete -> round increase 
    if (done == numberOfQuestions) {
      round++
      user.setRound(round)
      //setRound(senderID, round)
      //console.log("usersData in nextRound= ", usersData)
    }
    //create button ask for next round
    let buttonMessage = createButton.createButtonNextRound(senderID)
    callSendAPI(buttonMessage)
  }

  const startNextRound = async (senderID, round) => {
    //ready to ask question
    //reset state = playing
    state = "playing"
    let keysLeftForThatUser = await getKeys()
    user.setState({ state, keysLeftForThatUser, round, "done": 0 })
    //setState(senderID, { state, keysLeftForThatUser, round, "done": 0 })

    let shuffledKey = utillArray.shuffleKeyFromQuestions(keysLeftForThatUser)
    currentQuestionKey = shuffledKey
    answerForEachQuestion = await firebase.getAllAnswersFromQuestion(shuffledKey)
    console.log("answerForEachQuestion next round = ", answerForEachQuestion)

    if (answerForEachQuestion == null) {
      console.log("Doesn't have this id in questions database")
      return null
    }

    const buttonsCreated = await createButton.createButtonFromQuestionId(shuffledKey)
    const buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)
    startedAt = utillArray.getMoment()
    callSendAPI(buttonMessage)
  }

  /*
   * Message Read Event
   *
   * This event is called when a previously-sent message has been read.
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
   * 
   */
  // function receivedMessageRead(event) {
  //   let senderID = event.sender.id
  //   let recipientID = event.recipient.id

  //   // All messages before watermark (a timestamp) or sequence have been seen.
  //   let watermark = event.read.watermark
  //   let sequenceNumber = event.read.seq

  //   console.log("Received message read event for watermark %d and sequence " +
  //     "number %d", watermark, sequenceNumber)
  // }

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
    //startedAt = utillArray.getMoment() //get started time
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
    state = "playing"
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

