import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuizItem from './QuizItem'
import QuizCount from './QuizCount'

export const Footer = quizCount => <QuizCount quizCount={quizCount.quizCount} />

class MainSectionQuiz extends Component {
  render () {
    const { actions, quests } = this.props
    return (
      <section>
        {quests &&
          (!quests.length
            ? <div><br />You have no quizzes, try adding some quiz now!</div>
            : <ul>
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
