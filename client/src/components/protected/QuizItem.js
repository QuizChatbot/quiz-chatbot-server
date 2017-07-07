import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import QuizInput from './QuizInput'
import IconButton from 'material-ui/IconButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'

export const Element = ({ quest, deleteQuiz, editQuiz }) => {
  function handleSave (id, quiz, isChoice) {
    editQuiz(`${id}`, quiz, isChoice)
  }

  return (
    <div>
      <QuizInput
        quest={quest}
        onSave={(quiz, isChoice) => handleSave(quest.id, quiz, isChoice)}
      />
      <IconButton tooltip='Delete'>
        <ActionDelete onTouchTap={() => deleteQuiz(quest.id)} />
      </IconButton>
    </div>
  )
}

class QuizItem extends Component {
  render () {
    const { quest, deleteQuiz, editQuiz } = this.props
    return (
      <li className={classnames({ completed: quest.completed })}>
        <Element quest={quest} deleteQuiz={deleteQuiz} editQuiz={editQuiz} />
      </li>
    )
  }
}

QuizItem.propTypes = {
  quest: PropTypes.object,
  editQuiz: PropTypes.func,
  deleteQuiz: PropTypes.func
}

export default QuizItem
