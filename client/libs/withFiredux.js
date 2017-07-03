import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as QuizActions from '../actions'
function mapStateToProps(state) {
  return { firedux: state.firedux }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(QuizActions, dispatch) }
}
const withFiredux = connect(mapStateToProps, mapDispatchToProps)
export default withFiredux