import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import QuizInput from './QuizInput'

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
      <button className='destroy' onClick={() => deleteQuiz(quest.id)} />
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
