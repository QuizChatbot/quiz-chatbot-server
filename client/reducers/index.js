import { combineReducers } from 'redux'
import firedux from '../store/firedux'
import developerData from './developerData'
import app from './app'

const rootReducer = combineReducers({
  firedux: firedux.reducer(),
  developerData,
  app
})

export default rootReducer
