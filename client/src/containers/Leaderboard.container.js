import Leaderboard from '../components/Leaderboard'
import withFiredux from '../libs/withFiredux'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { setCategory } from '../actions'
import { bindActionCreators } from 'redux'

const filterDeveloperByCategory = (developers, category) =>
  developers
    .filter(item => !!item[category])
    .sort((a, b) => b[category].score - a[category].score)

export default compose(
  withFiredux,
  connect(
    state => ({
      developers: filterDeveloperByCategory(
        state.developerData.developers,
        state.categoryData.category
      ),
      currentCategory: state.categoryData.category
    }),
    dispatch => {
      return { setCategory: bindActionCreators(setCategory, dispatch) }
    }
  )
)(Leaderboard)

// const LeaderboardWithFiredux = withFiredux(Leaderboard);

// const mapToState = state => ({
//   developers: state.developerData.developers
// })
// const LeaderboardWithFireduxWithConnect = connect()(LeaderboardWithFiredux)
