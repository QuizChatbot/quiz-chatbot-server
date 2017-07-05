import React, { PropTypes, Component } from 'react'

export const QuizCount = ({ count }) => {
  const itemWord = count === 1 ? 'item' : 'items'
  return (
    <span className="todo-count">
      <strong>{count || 'No'}</strong> {itemWord}
    </span>
  )
}

class FooterQuiz extends Component {
  render() {
    const { quizCount } = this.props
    return (
      <footer className="footer">
        <QuizCount count={quizCount} />
      </footer>
    )
  }
}

FooterQuiz.propTypes = {
  quizCount: PropTypes.number,
}

export default FooterQuiz
