const readQuestions = function() {
   const questions = require('./questions.json')
   return questions
}

const createButtonFromQuestionId = function(id){
        let questions = readQuestions()

        let qKey = Object.keys(questions)
        let hasId = qKey.indexOf(id) > -1

        //no question that match the id
        if(!hasId)      return null

        console.log("createButtonFromQuestionId = ", questions)

        let question = questions[id]
        let answers = question.answer
  
        //push key and value to button 
        //but we will delete the 'subject' and 'question' key later'
        let buttons = []
        answers.forEach(function(element) {
                buttons.push({
                        type: "postback",
                        title: element,
                        payload: JSON.stringify({"answer" : element,"question" : id})
        })
        }, this);
        console.log("buttons =", buttons)
        
        return {buttons : buttons,
                subject : question.subject,
                question : question.question
                } 
}

const createButtonMessageWithButtons = function(recipientId, buttons) {
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
          buttons : buttons.buttons
        }
      }
    }
  };
  console.log("mssgdata = ",messageData)
  console.log("mssgdata buttons= ",buttons)
  return messageData
}

//get all answer from that question in array
const getAllAnswerFromQuestion = function(id){
        let questions = readQuestions()
        let qKey = Object.keys(questions)
        let hasId = qKey.indexOf(id) > -1
        //no question that match the id
        if(!hasId)      return null

        let question = questions[id]
        let answers = question.answer
        console.log("answers in getAllAnswerFromQuestion = ", answers)
        return answers
}

module.exports={readQuestions,createButtonFromQuestionId, createButtonMessageWithButtons, getAllAnswerFromQuestion}
