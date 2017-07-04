import React, { PropTypes, Component } from 'react'
import { firebaseToArray } from '../utils'

export const LeaderboardItem = ({ idx, developer }) => (
  <h2>{idx + 1}. {developer.profile.first_name} {developer.maxSummary.grade} ( score: {developer.maxSummary.score} )</h2>
)

export class Leaderboard extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div>
        <h2>Leaderboard</h2>
        {!this.props.developers.length ?
          (<div>No Players</div>)
          : this.props.developers.map((developer, idx) =>
            <LeaderboardItem key={idx} idx={idx} developer={developer} />
          )}
      </div>
    )
  }
}

export default Leaderboard
