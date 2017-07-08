import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderQuiz from './HeaderQuiz'
import MainSectionQuiz from '../../containers/MainSectionQuiz.container'

class MyQuiz extends Component {
  render () {
    const { actions } = this.props
    return (
      <div>
        <HeaderQuiz addQuiz={actions.addQuiz} />
        <MainSectionQuiz actions={actions} />
      </div>
    )
  }
}

MyQuiz.propTypes = {
  actions: PropTypes.object.isRequired
}

export default MyQuiz
