import Leaderboard from '../components/Leaderboard'
import withFiredux from '../libs/withFiredux'
import { connect } from 'react-redux'
import { compose } from 'redux'

export default compose(
  withFiredux,
  connect(
    state => ({
      developers: state.developerData.developers
    })
  )
)(Leaderboard)

// const LeaderboardWithFiredux = withFiredux(Leaderboard);

// const mapToState = state => ({
//   developers: state.developerData.developers
// })
// const LeaderboardWithFireduxWithConnect = connect()(LeaderboardWithFiredux)