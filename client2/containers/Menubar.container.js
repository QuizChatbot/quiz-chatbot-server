import Menubar from '../components/Menubar'
import withFiredux from '../libs/withFiredux'
import { connect } from 'react-redux'
import { compose } from 'redux'

export default compose(
  withFiredux,
  connect(
    state => ({
      authed: state.app.authed,
    })
  )
)(Menubar)
