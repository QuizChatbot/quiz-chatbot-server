import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import firedux from './store/firedux'
import * as Actions from './actions'
import App from './containers/App'
// import 'todomvc-app-css/index.css'

firedux.watch('Developer').then(() => {
  store.dispatch(Actions.getDeveloper())
})

firedux.watch('Quests').then(() => {
  store.dispatch(Actions.getQuest())
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
