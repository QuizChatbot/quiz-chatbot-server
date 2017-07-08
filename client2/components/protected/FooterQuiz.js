import React, { PropTypes, Component } from 'react'

export const QuizCount = ({ count }) => {
  const itemWord = count === 1 ? 'item' : 'items'
  return (
    <span>
      <strong>{count || 'No'}</strong> {itemWord}
    </span>
  )
}

class FooterQuiz extends Component {
  render () {
    const { quizCount } = this.props
    return (
      <footer>
        <QuizCount count={quizCount} />
      </footer>
    )
  }
}

FooterQuiz.propTypes = {
  quizCount: PropTypes.number
}

export default FooterQuiz
