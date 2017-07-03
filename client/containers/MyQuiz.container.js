
import MyQuiz from '../components/protected/MyQuiz'
import withFiredux from '../libs/withFiredux'
import * as Actions from '../actions'
import store from '../store'
import firedux from '../store/firedux'

// firedux.watch('Quests').then(() => {
//   store.dispatch(Actions.getQuest())
// })

export default withFiredux(MyQuiz)