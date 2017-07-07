import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuizItem from './QuizItem'
import FooterQuiz from './FooterQuiz'

export const Footer = quizCount => (
  <FooterQuiz quizCount={quizCount.quizCount} />
)

class MainSectionQuiz extends Component {
  render () {
    const { actions, quests } = this.props
    return (
      <section className='main'>
        {quests &&
          (!quests.length
            ? <div>No Quizzes</div>
            : <ul className='todo-list'>
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
