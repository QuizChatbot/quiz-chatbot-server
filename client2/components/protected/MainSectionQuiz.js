import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import QuizItem from './QuizItem'
import FooterQuiz from './FooterQuiz'
import { firebaseToArray } from '../../utils'

export const Footer = quizCount => (
  <FooterQuiz quizCount={quizCount.quizCount} />
)

class MainSectionQuiz extends Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    const { actions, quests } = this.props
    return (
      <section>
        {quests &&
          (!quests.length
            ? <div>No Quizzes</div>
            : <ul>
              {quests.map(quest => (
                <QuizItem key={quest.id} quest={quest} {...actions} />
                ))}
              <Footer quizCount={quests.length} />
            </ul>)}
      </section>
    )
  }
}

MainSectionQuiz.propTypes = {
  actions: PropTypes.object.isRequired,
  quests: PropTypes.array.isRequired
}

export default MainSectionQuiz
