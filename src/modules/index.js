import { combineReducers } from 'redux'
import counter from './counter'
import flow from './flow'
import alerts from './alerts'
import lobby from './lobby'
import user from './user'
import error from './error'
import app from './app'
import createHistory from 'history/createBrowserHistory'
import { connectRouter } from "connected-react-router"

export const history = createHistory()

export default combineReducers({
  counter,
  flow,
  alerts,
  lobby,
  user,
  error,
  router: connectRouter(history),
  app
})
