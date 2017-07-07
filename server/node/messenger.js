const request = require('request')
const config = require('./config')

let APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL

  APP_SECRET = config.APP_SECRET
  VALIDATION_TOKEN = config.VALIDATION_TOKEN
  PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN
  SERVER_URL = config.SERVER_URL

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
  messenger.callSendAPI(messageData)
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

function setGreetingText() {
  let greetingData = {
    setting_type: "greeting",
    greeting: {
      text: "Welcome to QuizChatbot!"
    }
  };
  createGreetingApi(greetingData)
}

module.exports = {sendTextMessage, callSendAPI, getUserDetail, sendLetsQuiz, createGreetingApi, setGreetingText}