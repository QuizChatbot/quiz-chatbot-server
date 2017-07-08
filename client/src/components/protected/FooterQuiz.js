import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const QuizCount = ({ count }) => {
  const itemWord = count === 1 ? 'item' : 'items'
  const quizWord = count === 1 ? 'quiz' : 'quizzes'
  return (
    <span>
      Your {quizWord} ({count || 'No'} {itemWord}) : <br />
    </span>
  )
}

class FooterQuiz extends Component {
  render () {
    const { quizCount } = this.props
    return (
      <div>
        <QuizCount count={quizCount} />
      </div>
    )
  }
}

FooterQuiz.propTypes = {
  quizCount: PropTypes.number
}

export default FooterQuiz
