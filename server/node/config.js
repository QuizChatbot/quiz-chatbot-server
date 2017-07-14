const config = require('config')

let APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL, UNIVERSAL_ANALYTICS
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

  UNIVERSAL_ANALYTICS = (process.env.UNIVERSAL_ANALYTICS) ?
    (process.env.UNIVERSAL_ANALYTICS) :
    config.get('universalAnalytics')

  if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL && UNIVERSAL_ANALYTICS)) {
    console.error("Missing config values")
    process.exit(1)
  }

} catch (err) {

}

module.exports = { APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL, UNIVERSAL_ANALYTICS }