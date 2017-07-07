import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  getBlankQuest,
  getQuestFromProps,
  getQuizStatefromQuest
} from '../../libs/quizHelper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'

class QuizInput extends Component {
  constructor (props, context) {
    super(props, context)
    let quest = getQuestFromProps(props.quest)
    this.state = getQuizStatefromQuest(quest)
  }

  handleSubmit = e => {
    const { newQuiz, onSave } = this.props

    // Save quiz
    const { subject, question, choice_0, choice_1, choice_2 } = this.state
    onSave({ subject, question, choice_0, choice_1, choice_2 })

    if (newQuiz) {
      this.setState(getBlankQuest())
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDoubleClick = form => {
    this.setState({ isEditing: { [form]: true } })
  }

  handleBlur = form => {
    const { newQuiz, onSave } = this.props
    if (!newQuiz) {
      let keys = form.split('_')
      let quiz = keys[0] === 'choice'
        ? { [keys[1]]: this.state[form] }
        : { [form]: this.state[form] }
      let isChoice = keys[0] === 'choice'
      onSave(quiz, isChoice)
      this.setState({ isEditing: { [form]: false } })
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  renderForm (form, autoFocus) {
    const { newQuiz } = this.props
    if (this.state.isEditing[form] || newQuiz) {
      return (
        <div>
          <TextField
            ref={form}
            type='text'
            name={form}
            floatingLabelText={form}
            // defaultValue={this.state[form]}
            value={this.state[form]}
            autoFocus={autoFocus || this.state.isEditing[form]}
            onChange={this.handleChange}
            onBlur={() => this.handleBlur(form)}
          />

        </div>
      )
    } else {
      return (
        <div className='view'>
          <label onDoubleClick={() => this.handleDoubleClick(form)}>
            {form}: {this.state[form]}
          </label>
          <br />
        </div>
      )
    }
  }

  renderSubmitButton () {
    const { newQuiz } = this.props
    if (newQuiz) {
      return (
        <div>
          <RaisedButton
            type='submit'
            label='Submit'
            primary
            onTouchTap={this.handleSubmit}
          />
          <Snackbar
            open={this.state.open}
            message='Quiz added'
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      )
    }
  }

  render () {
    const { newQuiz } = this.props
    const autoFocus = true
    return (
      <div>
        {this.renderForm('subject', autoFocus)}
        {this.renderForm('question')}
        {this.renderForm('choice_0')}
        {this.renderForm('choice_1')}
        {this.renderForm('choice_2')}
        {newQuiz && this.renderSubmitButton()}
      </div>
    )
  }
}

QuizInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  quest: PropTypes.object,
  newQuiz: PropTypes.bool
}

export default QuizInput
