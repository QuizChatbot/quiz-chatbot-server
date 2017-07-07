import { combineReducers } from 'redux'
import firedux from '../store/firedux'
import developerData from './developerData'
import questData from './questData'
import app from './app'

const rootReducer = combineReducers({
  firedux: firedux.reducer(),
  developerData,
  questData,
  app
})

export default rootReducer
