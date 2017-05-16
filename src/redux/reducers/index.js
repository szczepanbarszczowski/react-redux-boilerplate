// @flow

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import common from './commonReducer'

const rootReducer = combineReducers({
  routing: routerReducer,
  common
})

export default rootReducer
