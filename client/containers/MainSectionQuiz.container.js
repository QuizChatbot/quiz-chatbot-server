import MainSectionQuiz from '../components/protected/MainSectionQuiz'
import { connect } from 'react-redux'

export default connect(
  state => ({
    quests: state.questData.quests
  })
)(MainSectionQuiz)
