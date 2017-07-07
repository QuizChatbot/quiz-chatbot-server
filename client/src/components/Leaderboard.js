import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const LeaderboardItem = ({ idx, developer }) => (
  <h2>
    {idx + 1}
    .
    {' '}
    {developer.profile.first_name}
    {' '}
    {developer.profile.last_name}
    {' '}
    {developer.maxSummary.grade}
    {' '}
    ( score:
    {' '}
    {developer.maxSummary.score}
    {' '}
    )
  </h2>
)

class Leaderboard extends Component {
  render () {
    const { developers } = this.props
    return (
      <div>
        <h2>Leaderboard</h2>
        {!developers.length
          ? <div>No Players</div>
          : developers.map((developer, idx) => (
            <LeaderboardItem key={idx} idx={idx} developer={developer} />
            ))}
      </div>
    )
  }
}

Leaderboard.PropTypes = {
  developers: PropTypes.object.isRequired
}

export default Leaderboard