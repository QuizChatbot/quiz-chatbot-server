import React, { Component, PropTypes } from 'react'
import QuizItem from './QuizItem'
import FooterQuiz from './FooterQuiz'
import { firebaseToArray } from '../../utils'
import store from '../../store'

class MainSectionQuiz extends Component {
  constructor(props, context) {
    super(props, context)
  }

  getQuests() {
    let { Quests } = this.props.firedux.data
    return firebaseToArray(Quests)
  }

  renderFooterQuiz(completedCount) {
    let quests = this.getQuests()
    const activeCount = quests.length - completedCount
    if (quests.length) {
      return (<FooterQuiz activeCount={activeCount} />)
    }
  }

  render() {
    const { actions } = this.props
    let quests = this.getQuests()
    quests.sort(function (a, b) { return (b.updatedAt > a.updatedAt) ? 1 : ((a.updatedAt > b.updatedAt) ? -1 : 0); })
    const completedCount = quests.reduce((count, quest) => quest.completed ? count + 1 : count, 0)

    return (
      <section className="main">
        <ul className="todo-list">
          {quests.map(quest => <QuizItem key={quest.id} quest={quest} {...actions} />)}
        </ul>
        {this.renderFooterQuiz(completedCount)}
      </section>
    )
  }
}

MainSectionQuiz.propTypes = {
  actions: PropTypes.object.isRequired,
  firedux: PropTypes.object.isRequired
}

export default MainSectionQuiz
