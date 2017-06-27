const firebase = require('./firebase.js')

const readQuestions = function () {
  const questions = require('./questions.json')
  return questions
}

const createButtonFromQuestionId = async (id) => {
  let question = await firebase.getQuestionFromId(id)
  console.log("questions in createButtonFromQuestionId = ", question)
  let choices = question.choices
  console.log("choices in createButtonFromQuestionId = ", choices)
  //push key and value to button 
  //but we will delete the 'subject' and 'question' key later'
  let buttons = []

    choices.forEach(function (element) {
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

  const createButtonMessageWithButtons = (recipientId, buttons) => {
    //delete 'subject' and 'question' key that comes with buttons
    let subject = buttons.subject
    let question = buttons.question
    delete buttons.subject
    delete buttons.question

    var messageData = {
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

  module.exports = { readQuestions, createButtonFromQuestionId, createButtonMessageWithButtons, createButtonNextRound, createButtonNext }
