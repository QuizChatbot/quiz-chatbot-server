const firebase = require('./firebase.js')

const readQuestions = function () {
  const questions = require('./questions.json')
  return questions
}

const createButtonFromQuestionId = async (id) => {
  let question = await firebase.getQuestionFromId(id)
  let answers = question.answers

  //push key and value to button 
  //but we will delete the 'subject' and 'question' key later'
  let buttons = []

  answers.forEach(function (element) {
    buttons.push({
      type: "postback",
      title: element,
      payload: JSON.stringify({ "answer": element, "question": id, "point": question.point })
    })
  }, this);

  console.log("buttons =", buttons)

  return {
    buttons: buttons,
    subject: question.subject,
    question: question.question
  }
}

const createButtonMessageWithButtons = (recipientId, buttons) => {
  //delete 'subject' and 'question' key from buttons
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

module.exports = { readQuestions, createButtonFromQuestionId, createButtonMessageWithButtons}
