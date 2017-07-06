const getBlankQuest = () => ({
  subject: '',
  question: '',
  choice_0: '',
  choice_1: '',
  choice_2: ''
})

const getQuestFromProps = quest => {
  if (quest == undefined) return {}
  const { subject, question, choices } = quest
  return {
    subject,
    question,
    choice_0: choices[0],
    choice_1: choices[1],
    choice_2: choices[2]
  }
}

const getQuizStatefromQuest = ({
  subject = '',
  question = '',
  choice_0 = '',
  choice_1 = '',
  choice_2 = ''
}) => ({
  subject,
  question,
  choice_0,
  choice_1,
  choice_2,
  isEditing: {
    subject: false,
    question: false,
    choice_0: false,
    choice_1: false,
    choice_2: false
  }
})

export { getBlankQuest, getQuestFromProps, getQuizStatefromQuest }
