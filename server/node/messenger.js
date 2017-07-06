const request = require('request')
const config = require('config')

let APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL

try {
  // App Secret can be retrieved from the App Dashboard
  APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret')

  // Arbitrary value used to validate a webhook
  VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
    (process.env.MESSENGER_VALIDATION_TOKEN) :
    config.get('validationToken')

  // Generate a page access token for your page from the App Dashboard
  PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
    (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
    config.get('pageAccessToken')

  // URL where the app is running (include protocol). Used to point to scripts and 
  // assets located at this address. 
  SERVER_URL = (process.env.SERVER_URL) ?
    (process.env.SERVER_URL) :
    config.get('serverURL')

  if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values")
    process.exit(1)
  }

} catch (error) {
  console.warn(error)
}

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

module.exports = {sendTextMessage, callSendAPI}