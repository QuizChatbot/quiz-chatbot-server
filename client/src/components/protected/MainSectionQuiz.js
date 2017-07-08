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
            ? <div><br />You have no quizzes, try adding some quiz now!</div>
            : <ul className='todo-list'>
              <Footer quizCount={quests.length} />
              {quests.map((quest, idx) => (
                <QuizItem
                  idx={idx + 1}
                  key={quest.id}
                  quest={quest}
                  {...actions}
                  />
                ))}
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
