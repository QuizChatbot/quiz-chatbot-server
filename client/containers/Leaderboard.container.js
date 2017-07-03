
import Leaderboard from '../components/Leaderboard'
import withFiredux from '../libs/withFiredux'
import * as Actions from '../actions'
import store from '../store'
import firedux from '../store/firedux'

firedux.watch('Developer').then(() => {
  store.dispatch(Actions.getDeveloper())
})

firedux.watch('Quests').then(() => {
  store.dispatch(Actions.getQuest())
})

export default withFiredux(Leaderboard)
