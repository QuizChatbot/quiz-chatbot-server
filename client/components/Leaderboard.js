import React, { PropTypes, Component } from 'react'
import { firebaseToArray } from '../utils'
import { connect } from 'react-redux'

class Leaderboard extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div>
        <h2>Leaderboard</h2>
        {!this.props.developers.length
          ? (<div>No Players</div>)
          : this.props.developers.map((developer, idx) =>
            <h2 key={idx + 1}>
              {idx + 1}. {developer.profile.first_name} {developer.maxSummary.grade} ( score: {developer.maxSummary.score} )
            </h2>)}
      </div>
    )
  }
}

export default connect(
  state => ({
    developers: state.developerData.developers
  })
)(Leaderboard)
