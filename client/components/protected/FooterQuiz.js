import React, { PropTypes, Component } from 'react'
import classnames from 'classnames'

class Footer extends Component {
  renderQuizCount() {
    const { quizCount } = this.props
    const itemWord = quizCount === 1 ? 'item' : 'items'
    return (
      <span className="todo-count">
        <strong>{quizCount || 'No'}</strong> {itemWord}
      </span>
    )
  }

  render() {
    return (
      <footer className="footer">
        {this.renderQuizCount()}
      </footer>
    )
  }
}

Footer.propTypes = {
  quizCount: PropTypes.number.isRequired,
}

export default Footer
