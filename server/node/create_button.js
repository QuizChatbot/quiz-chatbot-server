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

const createButtonShare = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        share_contents: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "I took Peter's 'Which Hat Are You?' Quiz",
                  subtitle: "My result: Fez",
                  image_url: "https://bot.peters-hats.com/img/hats/fez.jpg",
                  default_action: {
                    type: "web_url",
                    url: "https://m.me/petershats?ref=invited_by_24601"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://m.me/petershats?ref=invited_by_24601",
                      title: "Take Quiz"
                    }
                  ]
                }
              ]
            }
          }


        }
        // payload: {
        //   template_type: "generic",
        //   elements: [{
        //     title: "Share",
        //     subtitle: "subtitle",
        //     image_url: "gs://quizchatbot-ce222.appspot.com/19197430_10206845610977801_1649716001_o.jpg",
        //     buttons: [{
        //       type: "element_share"
        //     }
        //     ]
        //   }]
        // }
      }
    }
  };
  console.log("__Button 1 = ", messageData)
  return messageData
}

const createButtonShare2 = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {},
    buttons: [
      {
        type: "element_share",
        share_contents: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "I took Peter's 'Which Hat Are You?' Quiz",
                  subtitle: "My result: Fez",
                  image_url: "https://bot.peters-hats.com/img/hats/fez.jpg",
                  default_action: {
                    type: "web_url",
                    url: "https://m.me/petershats?ref=invited_by_24601"
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://m.me/petershats?ref=invited_by_24601",
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
  };
  console.log("__Buttons__ = ", messageData)
  return messageData
}


module.exports = { createButtonFromQuestionId, createButtonMessageWithButtons, createButtonNextRound, createButtonNext, createButtonCategory, createButtonShare, createButtonShare2 }
