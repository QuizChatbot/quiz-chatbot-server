import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuizInput from './QuizInput'

class HeaderQuiz extends Component {
  handleSave (quiz) {
    this.props.addQuiz(quiz)
  }

  render () {
    return (
      <header>
        <QuizInput newQuiz onSave={this.handleSave.bind(this)} />
      </header>
    )
  }
}

HeaderQuiz.propTypes = {
  addQuiz: PropTypes.func
}

export default HeaderQuiz
