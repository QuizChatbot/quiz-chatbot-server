import { combineReducers } from 'redux'
import firedux from '../store/firedux'
import developerData from './developerData'
import questData from './questData'
import categoryData from './categoryData'
import app from './app'

const rootReducer = combineReducers({
  firedux: firedux.reducer(),
  developerData,
  questData,
  categoryData,
  app
})

export default rootReducer
