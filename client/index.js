import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import * as Actions from './actions'
import store from './store'
import 'todomvc-app-css/index.css'
import firedux from './store/firedux'

firedux.watch('Quests')
firedux.watch('Developer').then(() => {
  store.dispatch(Actions.getDeveloper())
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
