const firebase = require('./firebase.js')
const utillArray = require('./utill_array')

/**
 * Create buttons object include choices,subject,question
 * @param {string} id 
 * @return {object} 
 * @async
 */
const createButtonFromQuestionId = async (id) => {
  let question = await firebase.getQuestionFromId(id)
  console.log("questions in createButtonFromQuestionId = ", question)
  //shuffle choices
  let choices = utillArray.shuffleChoices(question.choices)
  console.log("choices in createButtonFromQuestionId = ", choices)
  //push key and value to button 
  //but we will delete the 'subject' and 'question' key later'
  let buttons = []

  choices.forEach((element) => {
    buttons.push({
      type: "postback",
      title: element,
      payload: JSON.stringify({ "answer": element, "question": id, "point": question.point })
    })
  }, this)

  console.log("buttons =", buttons)

  return {
    buttons: buttons,
    subject: question.subject,
    question: question.question
  }
}

/**
 * Create buttons ready to send
 * @param {string} recipientId 
 * @param {object} buttons 
 * @return {object}
 */
const createButtonMessageWithButtons = (recipientId, buttons) => {
  //delete 'subject' and 'question' key that comes with buttons
  let subject = buttons.subject
  let question = buttons.question
  delete buttons.subject
  delete buttons.question

  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: subject + "\n" + question,
          buttons: buttons.buttons
        }
      }
    }
  };
  console.log("mssgdata buttons= ", buttons)
  return messageData
}

/**
 * Create button asked for next round
 * @param {string} recipientId 
 * @return {object}
 */
const createButtonNextRound = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Do you want to play the next round?",
          buttons: [{
            type: "postback",
            title: "Yes",
            payload: JSON.stringify({ "nextRound": true })
          }, {
            type: "postback",
            title: "No",
            payload: JSON.stringify({ "nextRound": false })
          }]
        }
      }
    }
  };

  return messageData
}

/**
 * Create button asked for next question 
 * @param {string} recipientId
 * @return {object} 
 */
const createButtonNext = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Wanna play next question?",
          buttons: [{
            type: "postback",
            title: "Yes",
            payload: JSON.stringify({ "nextQuestion": true })
          }, {
            type: "postback",
            title: "No",
            payload: JSON.stringify({ "nextQuestion": false })
          }]
        }
      }
    }
  };

  return messageData
}

/**
 * Create button asked which category to play
 * @param {string} recipientId 
 * @return {object}
 */
const createButtonCategory = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Choose category, please.",
          buttons: [{
            type: "postback",
            title: "12 Factors App",
            payload: JSON.stringify({ "category": "12 factors app" })
          }, {
            type: "postback",
            title: "Design Patterns",
            payload: JSON.stringify({ "category": "design patterns" })
          },
          {
            type: "postback",
            title: "Rules of Thumb",
            payload: JSON.stringify({ "category": "rules of thumb" })
          }]
        }
      }
    }
  };

  return messageData
}

const createButtonShare = (recipientId, score, grade) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Quiz Chatbot Leaderboard",
            subtitle: `You've got ${score} grade ${grade}!`,
            image_url: "http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg",
            buttons: [{
              type: "element_share",
                      share_contents: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "I played Quiz Chatbot!",
                  subtitle: `I've got ${score} grade ${grade}! Wanna play?`,
                  image_url: "http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg",
                  default_action: {
                    type: "web_url",
                    url: "https://quizchatbot-ce222.firebaseapp.com/"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://quizchatbot-ce222.firebaseapp.com/",
                      title: "Take Quiz"
                    }
                  ]
                }
              ]
            }
          }


        }
            }
            ]
          }]
        }
      }
    }
  };
 
  return messageData
}


module.exports = { createButtonFromQuestionId, createButtonMessageWithButtons, createButtonNextRound, createButtonNext, createButtonCategory, createButtonShare }

