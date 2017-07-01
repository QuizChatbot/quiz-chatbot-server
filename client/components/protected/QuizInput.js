import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class QuizInput extends Component {
  constructor(props, context) {
    super(props, context)
    let quest = (props.quest != undefined) ? {
      subject: props.quest.subject,
      question: props.quest.question,
      choice_0: props.quest.choices[0],
      choice_1: props.quest.choices[1],
      choice_2: props.quest.choices[2],
    } : {}

    this.state = {
      subject: quest.subject || '',
      question: quest.question || '',
      choice_0: quest.choice_0 || '',
      choice_1: quest.choice_1 || '',
      choice_2: quest.choice_2 || '',
      isEditing: {
        subject: false,
        question: false,
        choice_0: false,
        choice_1: false,
        choice_2: false
      }
    }
  }

  handleSubmit(e) {
    const quiz = {
      subject: this.state.subject,
      question: this.state.question,
      choice_0: this.state.choice_0,
      choice_1: this.state.choice_1,
      choice_2: this.state.choice_2,
    }
    this.props.onSave(quiz)
    if (this.props.newQuiz) {
      this.setState({
        subject: '',
        question: '',
        choice_0: '',
        choice_1: '',
        choice_2: '',
      })
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDoubleClick(form) {
    this.setState({ isEditing: { [form]: true } })
  }

  handleBlur(form) {
    if (!this.props.newQuiz) {
      let keys = form.split('_')
      let quiz = (keys[0] === 'choice') ? { [keys[1]]: this.state[form] } : { [form]: this.state[form] }
      let isChoice = (keys[0] === 'choice') ? true : false
      this.props.onSave(quiz, isChoice)
      this.setState({ isEditing: { [form]: false } })
    }
  }

  renderForm(form, autoFocus) {
    if (this.state.isEditing[form] || this.props.newQuiz) {
      return (
        <div>
          {form}:
          <input className={
            classnames({
              // edit: this.props.editing,
              'new-todo': this.props.newQuiz || this.state.isEditing[form]
            })}
            type="text"
            name={form}
            placeholder={form + "??"}
            value={this.state[form]}
            autoFocus={autoFocus}
            onChange={this.handleChange.bind(this)}
            onBlur={() => this.handleBlur(form)}
          />
        </div>
      )
    } else {
      return (
        <div className="view">
          <label onDoubleClick={() => this.handleDoubleClick(form)}>
            {form}: {this.state[form]}
          </label>
          <br />
        </div>
      )
    }
  }

  renderSubmitButton() {
    if (this.props.newQuiz) {
      return (<button onClick={() => this.handleSubmit()}>Submit</button>)
    }
  }

  render() {
    const autoFocus = true
    return (
      <div>
        {this.renderForm("subject", autoFocus)}
        {this.renderForm("question")}
        {this.renderForm("choice_0")}
        {this.renderForm("choice_1")}
        {this.renderForm("choice_2")}
        {this.props.newQuiz ? this.renderSubmitButton() : <br />}
      </div>
    )
  }
}

QuizInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  quest: PropTypes.object,
  // editing: PropTypes.bool,
  newQuiz: PropTypes.bool
}

export default QuizInput
