import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const QuizWord = ({ count }) => {
  const itemWord = count === 1 ? 'item' : 'items'
  const quizWord = count === 1 ? 'quiz' : 'quizzes'
  return (
    <span>
      Your {quizWord} ({count || 'No'} {itemWord}) : <br />
      <i>You can edit the quiz by click on text</i>
    </span>
  )
}

class QuizCount extends Component {
  render () {
    const { quizCount } = this.props
    return (
      <div>
        <QuizWord count={quizCount} />
      </div>
    )
  }
}

QuizCount.propTypes = {
  quizCount: PropTypes.number
}

export default QuizCount
