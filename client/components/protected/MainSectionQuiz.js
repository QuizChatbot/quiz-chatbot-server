import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import QuizItem from './QuizItem'
import FooterQuiz from './FooterQuiz'
import { firebaseToArray } from '../../utils'

class MainSectionQuiz extends Component {
  constructor(props, context) {
    super(props, context)
  }

  renderFooterQuiz(quizCount) {
    return (<FooterQuiz quizCount={quizCount} />)
  }

  render() {
    const { actions } = this.props

    return (
      <section className="main">
        {this.props.quests &&
          (!this.props.quests.length
            ? (<div>No Quizzes</div>)
            : (<ul className="todo-list">
              {this.props.quests.map(quest =>
                <QuizItem key={quest.id} quest={quest} {...actions} />
              )}
              {this.renderFooterQuiz(this.props.quests.length)}
            </ul>))
        }
      </section>
    )
  }
}

MainSectionQuiz.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default MainSectionQuiz