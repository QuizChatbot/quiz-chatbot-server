import Leaderboard from '../components/Leaderboard'
import withFiredux from '../libs/withFiredux'
import { connect } from 'react-redux'
import { compose } from 'redux'

const category = 'design_patterns'
// const category = '12_factors_app'
const filterDeveloperByCategory = developers =>
  developers
    .filter(item => !!item[category])
    .sort((a, b) => b[category].score - a[category].score)

export default compose(
  withFiredux,
  connect(state => ({
    developers: filterDeveloperByCategory(state.developerData.developers),
    category
  }))
)(Leaderboard)

// const LeaderboardWithFiredux = withFiredux(Leaderboard);

// const mapToState = state => ({
//   developers: state.developerData.developers
// })
// const LeaderboardWithFireduxWithConnect = connect()(LeaderboardWithFiredux)
