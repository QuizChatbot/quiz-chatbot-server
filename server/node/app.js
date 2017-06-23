
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
    createButton = require('./readjson'),
    utillArray = require('./utill_array'),
    firebase = require('./firebase'),
    tunnelConfig = require('./tunnel.json'),
    summary = require('./summary')

  // config.serverURL = tunnelConfig.serverURL
  // console.log("config ", config, tunnelConfig)


  //let keys = await getKeys()
  let numberOfQuestions = await firebase.getNumberOfQuestions()
  let user
  let results
  let answerForEachQuestion
  let currentQuestionKey
  let startedAt
  let round = 1
  let done = 0
  let skill = "es6"
  let userScore = 0
  let userData = {}



  async function setState(userId, state) {
    if (!userData.hasOwnProperty(userId)) {
      userData[userId] = { state }
    } else {
      userData[userId] = state
    }
    console.log('userData = ', userData)
  }

  async function getState(userId) {
    if (!userData.hasOwnProperty(userId)) {
      return "initialize"
    } else {
      return userData[userId]
    }
  }

  async function getKeysLeftForThatUser(userId) {
    if (!userData.hasOwnProperty(userId)) {
      return "initialize"
    } else {
      return userData[userId].keys
    }
  }

  async function getKeys() {
    let keys = await firebase.getAllQuestionKeys()
    console.log("getkeys = ", keys)
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



  var app = express()
  app.set('port', process.env.PORT || 4000)
  app.set('view engine', 'ejs')
  app.use(bodyParser.json({ extended: false }))
  app.use(express.static('public'))


  var state = 0


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
  console.log('SERVER_URL = ', SERVER_URL)

  if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values")
    process.exit(1)
  }

  const getUserDetail = (senderID) => new Promise(async (resolve) => {

    const graph = `https://graph.facebook.com/v2.9/${senderID}?access_token=${PAGE_ACCESS_TOKEN}`
    console.log("graph user detail= ", graph);
    fetch(graph)
      .then(async function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        let json = await response.json();
        console.log("userDetail = ", json);
        resolve(json)
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

    var data = req.body
    // Make sure this is a page subscription
    if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(pageEntry => {
        var pageID = pageEntry.id
        var timeOfEvent = pageEntry.time

        // Iterate over each messaging event
        pageEntry.messaging.forEach(messagingEvent => {
          console.log("recieve mssg read")
          console.log(messagingEvent.read)
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
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */
  app.get('/authorize', function (req, res) {
    var accountLinkingToken = req.query.account_linking_token;
    var redirectURI = req.query.redirect_uri;
    console.log("/Authorize tokem = ", accountLinkingToken)
    // Authorization Code should be generated per user by the developer. This will 
    // be passed to the Account Linking callback.
    var authCode = "1234567890";

    // Redirect users to this URI on successful login
    var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

    res.render('authorize', {
      accountLinkingToken: accountLinkingToken,
      redirectURI: redirectURI,
      redirectURISuccess: redirectURISuccess
    });
  });


  /*
   * Verify that the callback came from Facebook. Using the App Secret from 
   * the App Dashboard, we can verify the signature that is sent with each 
   * callback in the x-hub-signature field, located in the header.
   *
   * https://developers.facebook.com/docs/graph-api/webhooks#setup
   *
   */
  function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
      // For testing, let's log an error. In production, you should throw an 
      // error.
      console.error("Couldn't validate the signature.");
    } else {
      var elements = signature.split('=');
      var method = elements[0];
      var signatureHash = elements[1];

      var expectedHash = crypto.createHmac('sha1', APP_SECRET)
        .update(buf)
        .digest('hex');

      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

  /*
   * Authorization Event
   *
   * The value for 'optin.ref' is defined in the entry point. For the "Send to 
   * Messenger" plugin, it is the 'data-ref' field. Read more at 
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
   *
   */
  function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the 
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger' 
    // plugin.
    var passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
      "through param '%s' at %d", senderID, recipientID, passThroughParam,
      timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    sendTextMessage(senderID, "Authentication successful");
  }

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
    var senderID = event.sender.id
    var recipientID = event.recipient.id
    var timeOfMessage = event.timestamp
    var message = event.message

    console.log("Received message for user %d and page %d at %d with message:",
      senderID, recipientID, timeOfMessage)
    console.log(JSON.stringify(message))

    var isEcho = message.is_echo
    var messageId = message.mid
    var appId = message.app_id
    var metadata = message.metadata

    // You may get a text or attachment but not both
    var messageText = message.text
    var messageAttachments = message.attachments
    var quickReply = message.quick_reply

    if (isEcho) {
      // Just logging message echoes to console
      console.log("Received echo for message %s and app %d with metadata %s",
        messageId, appId, metadata)
      return
    } else if (quickReply) {
      var quickReplyPayload = quickReply.payload;
      console.log("Quick reply for mesage %s with payload %s",
        messageId, quickReplyPayload)

      sendTextMessage(senderID, "Quick reply tapped");
      return
    }

    if (messageText) {
      switch (messageText) {
        case 'image':
          sendImageMessage(senderID)
          break

        case 'gif':
          sendGifMessage(senderID)
          break

        case 'audio':
          sendAudioMessage(senderID)
          break

        case 'video':
          sendVideoMessage(senderID)
          break

        case 'file':
          sendFileMessage(senderID)
          break

        case 'button':
          sendButtonMessage(senderID)
          break;

        case 'generic':
          sendGenericMessage(senderID)
          break

        case 'receipt':
          sendReceiptMessage(senderID)
          break

        case 'quick reply':
          sendQuickReply(senderID)
          break

        case 'read receipt':
          sendReadReceipt(senderID)
          break

        case 'typing on':
          sendTypingOn(senderID)
          break

        case 'typing off':
          sendTypingOff(senderID)
          break

        case 'account linking':
          sendAccountLinking(senderID)
          break

        default: {

          let keys = await getKeys()

          setState(senderID, { state, keys, round })
          let userState = await getState(senderID)
          console.log("user state = ", userState.state)
          console.log("user state.state = ", userState.state.state)

          //user chat with bot for the first time
          if (userState.state.state === 0) {
            if (!user) {
              let userDetail = await getUserDetail(senderID)
              user = userDetail
            }
            let firstName = user.first_name
            sendLetsQuiz(senderID, messageText, firstName)
            firebase.saveUserToFirebase(senderID, user)


            //Log in Button
            // var messageData = {
            //   recipient: {
            //     id: senderID
            //   },
            //   message: {
            //     attachment: {
            //       type: "template",
            //       payload: {
            //         template_type: "button",
            //         text: "What are you?",
            //         buttons: [{
            //           type: "account_link",
            //           url: "https://caab1a09.ngrok.io/authorize"

            //         }]
            //       }
            //     }
            //   }
            // };
            // callSendAPI(messageData)
          }

          //when set state again, data format will change
          //already quiz with chatbot
          else if (userState.state === 1) {

            let keysLeftForThatUser = await getKeysLeftForThatUser(senderID)
            console.log("keysLeftForThatUser = ", keysLeftForThatUser)
            //get keys question that user done
            let keysDone = await firebase.getQuestionDone(senderID)
            console.log("keyDone1 = ", keysDone)
            removeKeysDone(keys, keysDone)
            console.log("key left1 = ", keys)

            let shuffledKey = utillArray.shuffleKeyFromQuestions(keys)
            currentQuestionKey = shuffledKey
            answerForEachQuestion = await firebase.getAllAnswerFromQuestion(shuffledKey)
            if (answerForEachQuestion == null) {
              console.log("Doesn't have this id in questions database")
              return null
            }


            const buttonsCreated = await createButton.createButtonFromQuestionId(shuffledKey)
            const buttonMessage = await createButton.createButtonMessageWithButtons(senderID, buttonsCreated)
            startedAt = utillArray.getMoment()
            callSendAPI(buttonMessage)
          }
        }
      }
    } else if (messageAttachments) {
      sendTextMessage(senderID, "Message with attachment received")
    }
  }


  /*
   * Delivery Confirmation Event
   *
   * This event is sent to confirm the delivery of a message. Read more about 
   * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
   *
   */
  // function receivedDeliveryConfirmation(event) {
  //   var senderID = event.sender.id;
  //   var recipientID = event.recipient.id;
  //   var delivery = event.delivery;
  //   var messageIDs = delivery.mids;
  //   var watermark = delivery.watermark;
  //   var sequenceNumber = delivery.seq;

  //   if (messageIDs) {
  //     messageIDs.forEach(function(messageID) {
  //       console.log("Received delivery confirmation for message ID: %s", 
  //         messageID);
  //     });
  //   }

  //   console.log("All message before %d were delivered.", watermark);
  // }


  /*
   * Postback Event
   *
   * This event is called when a postback is tapped on a Structured Message. 
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
   * 
   */
  async function receivedPostback(event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    let payload = event.postback.payload;
    console.log("Received postback for user %d and page %d with payload '%s' " +
      "at %d", senderID, recipientID, payload, timeOfPostback);

    //if in question state when receive postback done = done +1 
    //number of question user answered incresae 
    if (await getState(senderID).state == 1) done++

    //check answer and ask next question
    let result = checkAnswer(payload, answerForEachQuestion)

    //Correct
    if (result) {
      sendTextMessage(senderID, "Good dog!")
      let preparedResult = prepareResultForFirebase(payload, answerForEachQuestion, result, startedAt, timeOfPostback)
      firebase.saveResultToFirebase(senderID, preparedResult)
    }
    //Wrong
    else {
      sendTextMessage(senderID, "Bad dog!")
      let preparedResult = prepareResultForFirebase(payload, answerForEachQuestion, result, startedAt, timeOfPostback)
      firebase.saveResultToFirebase(senderID, preparedResult)
    }

    //keys = removeKeyThatAsked(currentQuestionKey)

    let keysDone = await firebase.getQuestionDone(senderID)
    console.log("keyDone2 = ", keysDone)
    removeKeysDone(keys, keysDone)
    console.log("key left2 = ", keys)


    //send to calculate grade
    let duration = utillArray.calculateDuration(startedAt, timeOfPostback)
    let totalScore = summary.calculateTotalScore(numberOfQuestions)
    let scoreOfThatQuestion = summary.calculateScoreForThatQuestion(JSON.parse(payload).point, result, duration) //point for that question 
    userScore += scoreOfThatQuestion
    let grade = summary.calculateGrade(totalScore, userScore)

    //prepare summary object to save in firebase
    let preparedSummary = summary.prepareSummary(done, keys, round, skill, grade, userScore)
    console.log("summary = ", preparedSummary)
    firebase.saveSummaryToFirebase(senderID, preparedSummary)
    nextQuestion(senderID)

  }

  function checkAnswer(payload, answerForEachQuestion) {
    let userAnswerStr = payload
    let userAnswerObj = JSON.parse(userAnswerStr)
    console.log("check ansforeachQ = ", answerForEachQuestion)
    console.log("check ans that user choose  = ", userAnswerObj)
    //the correct answer is always in first element of answers in json file
    if (userAnswerObj.answer == answerForEachQuestion[0]) return true
    else return false

  }

  //set format of the result we want to save in firebase
  function prepareResultForFirebase(payload, answerForEachQuestion, result, startedAt, timeOfPostback) {
    let prepareObj = []
    let userAnswerObj = JSON.parse(payload)
    let doneAt = utillArray.getFormattedDate(timeOfPostback)
    let duration = utillArray.calculateDuration(startedAt, timeOfPostback)
    userAnswerObj.result = result
    userAnswerObj.doneAt = doneAt
    userAnswerObj.startedAt = startedAt
    userAnswerObj.duration = duration
    prepareObj.push(userAnswerObj)
    console.log("result = ", prepareObj)
    return prepareObj
  }

  async function nextQuestion(senderID) {
    //delete key of question that already asked from all keys
    //keys = removeKeyThatAsked(currentQuestionKey)

    console.log("keyToButton in nextQuestion after delete = ", keys)
    let keyOfNextQuestion = utillArray.shuffleKeyFromQuestions(keys)
    //define current key = key of question about to ask
    currentQuestionKey = keyOfNextQuestion
    console.log("keyToButton in nextQuestion = ", keyOfNextQuestion)

    //no question left
    //finish that round
    if (keyOfNextQuestion == null) {
      sendTextMessage(senderID, "Finish!")
      state = 2
      setState(senderID, { state, round })
      cons.log("set state after = ", userData)
      done = 0
      userScore = 0
    }
    else {
      //no key that matched question
      answerForEachQuestion = await firebase.getAllAnswerFromQuestion(keyOfNextQuestion)
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

  /*
   * Message Read Event
   *
   * This event is called when a previously-sent message has been read.
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
   * 
   */
  function receivedMessageRead(event) {
    var senderID = event.sender.id
    var recipientID = event.recipient.id

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark
    var sequenceNumber = event.read.seq

    console.log("Received message read event for watermark %d and sequence " +
      "number %d", watermark, sequenceNumber)
  }



  /*
   * Account Link Event
   *
   * This event is called when the Link Account or UnLink Account action has been
   * tapped.
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
   * 
   */
  async function receivedAccountLink(event) {
    var senderID = event.sender.id
    console.log("account linking token= ", event.account_linking_token)
    var recipientID = event.recipient.id

    var status = event.account_linking.status
    var authCode = event.account_linking.authorization_code

    console.log("Received account link event with for user %d with status %s " +
      "and auth code %s ", senderID, status, authCode);

    let resultPSID = await getUserPSID(senderID)
    console.log("result in receivedAccountLink = ", resultPSID)
  }

  // /*
  //  * Send an image using the Send API.
  //  *
  //  */
  // function sendImageMessage(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       attachment: {
  //         type: "image",
  //         payload: {
  //           url: SERVER_URL + "/assets/rift.png"
  //         }
  //       }
  //     }
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Send a Gif using the Send API.
  //  *
  //  */
  function sendGifMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: "https://static1.squarespace.com/static/572f8a5622482e952ab4082a/572f8c43859fd009b4395fef/572f8c60f8baf3257a30aac7/1462733922260/quicksilver+blue.gif?format=300w"
          }
        }
      }
    };

    callSendAPI(messageData)
  }

  /*
   * Send audio using the Send API.
   *
   */
  // function sendAudioMessage(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       attachment: {
  //         type: "audio",
  //         payload: {
  //           url: SERVER_URL + "/assets/sample.mp3"
  //         }
  //       }
  //     }
  //   };

  //   callSendAPI(messageData)
  // }s

  // /*
  //  * Send a video using the Send API.
  //  *
  //  */
  // function sendVideoMessage(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       attachment: {
  //         type: "video",
  //         payload: {
  //           url: SERVER_URL + "/assets/allofus480.mov"
  //         }
  //       }
  //     }
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Send a file using the Send API.
  //  *
  //  */
  // function sendFileMessage(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       attachment: {
  //         type: "file",
  //         payload: {
  //           url: SERVER_URL + "/assets/test.txt"
  //         }
  //       }
  //     }
  //   };

  //   callSendAPI(messageData);
  // }

  /*
   * Send a text message using the Send API.
   *
   */
  function sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };


    callSendAPI(messageData)
  }

  /*
   * Send a button message using the Send API.
   *
   */
  function sendButtonMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "What are you?",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Dog"
            }, {
              type: "postback",
              title: "Cat",
              payload: "DEVELOPER_DEFINED_PAYLOAD"
            }, {
              type: "phone_number",
              title: "Meow",
              payload: "+16505551234"
            }]
          }
        }
      }
    };

    callSendAPI(messageData)
  }

  /*
   * Send a Structured Message (Generic Message type) using the Send API.
   *
   */
  // function sendGenericMessage(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       attachment: {
  //         type: "template",
  //         payload: {
  //           template_type: "generic",
  //           elements: [{
  //             title: "rift",
  //             subtitle: "Next-generation virtual reality",
  //             item_url: "https://www.oculus.com/en-us/rift/",               
  //             image_url: SERVER_URL + "/assets/rift.png",
  //             buttons: [{
  //               type: "web_url",
  //               url: "https://www.oculus.com/en-us/rift/",
  //               title: "Open Web URL"
  //             }, {
  //               type: "postback",
  //               title: "Call Postback",
  //               payload: "Payload for first bubble",
  //             }],
  //           }, {
  //             title: "touch",
  //             subtitle: "Your Hands, Now in VR",
  //             item_url: "https://www.oculus.com/en-us/touch/",               
  //             image_url: SERVER_URL + "/assets/touch.png",
  //             buttons: [{
  //               type: "web_url",
  //               url: "https://www.oculus.com/en-us/touch/",
  //               title: "Open Web URL"
  //             }, {
  //               type: "postback",
  //               title: "Call Postback",
  //               payload: "Payload for second bubble",
  //             }]
  //           }]
  //         }
  //       }
  //     }
  //   };  

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Send a receipt message using the Send API.
  //  *
  //  */
  // function sendReceiptMessage(recipientId) {
  //   // Generate a random receipt ID as the API requires a unique ID
  //   var receiptId = "order" + Math.floor(Math.random()*1000);

  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message:{
  //       attachment: {
  //         type: "template",
  //         payload: {
  //           template_type: "receipt",
  //           recipient_name: "Peter Chang",
  //           order_number: receiptId,
  //           currency: "USD",
  //           payment_method: "Visa 1234",        
  //           timestamp: "1428444852", 
  //           elements: [{
  //             title: "Oculus Rift",
  //             subtitle: "Includes: headset, sensor, remote",
  //             quantity: 1,
  //             price: 599.00,
  //             currency: "USD",
  //             image_url: SERVER_URL + "/assets/riftsq.png"
  //           }, {
  //             title: "Samsung Gear VR",
  //             subtitle: "Frost White",
  //             quantity: 1,
  //             price: 99.99,
  //             currency: "USD",
  //             image_url: SERVER_URL + "/assets/gearvrsq.png"
  //           }],
  //           address: {
  //             street_1: "1 Hacker Way",
  //             street_2: "",
  //             city: "Menlo Park",
  //             postal_code: "94025",
  //             state: "CA",
  //             country: "US"
  //           },
  //           summary: {
  //             subtotal: 698.99,
  //             shipping_cost: 20.00,
  //             total_tax: 57.67,
  //             total_cost: 626.66
  //           },
  //           adjustments: [{
  //             name: "New Customer Discount",
  //             amount: -50
  //           }, {
  //             name: "$100 Off Coupon",
  //             amount: -100
  //           }]
  //         }
  //       }
  //     }
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Send a message with Quick Reply buttons.
  //  *
  //  */
  // function sendQuickReply(recipientId) {
  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     message: {
  //       text: "What's your favorite movie genre?",
  //       quick_replies: [
  //         {
  //           "content_type":"text",
  //           "title":"Action",
  //           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
  //         },
  //         {
  //           "content_type":"text", 
  //           "title":"Comedy",
  //           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
  //         },
  //         {
  //           "content_type":"text",
  //           "title":"Drama",
  //           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
  //         }
  //       ]
  //     }
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Send a read receipt to indicate the message has been read
  //  *
  //  */
  // function sendReadReceipt(recipientId) {
  //   console.log("Sending a read receipt to mark message as seen");

  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     sender_action: "mark_seen"
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Turn typing indicator on
  //  *
  //  */
  // function sendTypingOn(recipientId) {
  //   console.log("Turning typing indicator on");

  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     sender_action: "typing_on"
  //   };

  //   callSendAPI(messageData);
  // }

  // /*
  //  * Turn typing indicator off
  //  *
  //  */
  // function sendTypingOff(recipientId) {
  //   console.log("Turning typing indicator off");

  //   var messageData = {
  //     recipient: {
  //       id: recipientId
  //     },
  //     sender_action: "typing_off"
  //   };

  //   callSendAPI(messageData);
  // }

  /*
   * Send a message with the account linking call-to-action
   *
   */
  function sendAccountLinking(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Welcome. Link your account.",
            buttons: [{
              type: "account_link",
              url: SERVER_URL + "/authorize"
            }]
          }
        }
      }
    };

    callSendAPI(messageData);
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
          var recipientId = body.recipient_id
          var messageId = body.message_id

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
    var greetingData = {
      setting_type: "greeting",
      greeting: {
        text: "Welcome to QuizChatbot!"
      }
    };
    createGreetingApi(greetingData);
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
      });
  }


  async function sendLetsQuiz(recipientId, messageText, firstName) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "Welcome to Quizbot! " + firstName,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };
    state = 1;

    // setState(recipientId, {state, keys, round})
    // let testState =  await getState(recipientId)
    // console.log("state of that user = ", testState)
    callSendAPI(messageData);
  }


  // Start server
  // Webhooks must be available via SSL with a certificate signed by a valid 
  // certificate authority.
  app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
    setGreetingText()
  });

  module.exports = app


}

app()
