import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import {routerMiddleware} from 'react-router-redux'
import rootReducer from '../reducers'
import logic from '../logic'
import api from 'services/api'

// injected dependencies for logic
const deps = {
  httpClient: api
}

const configureStore = (preloadedState, history) => {
  const logicMiddleware = createLogicMiddleware(logic, deps)

  const middleware = applyMiddleware(
    logicMiddleware,
    routerMiddleware(history)
  )

	const store = createStore(
		rootReducer,
		preloadedState,
		compose(
			middleware,
			__DEV__ && window.devToolsExtension ? window.devToolsExtension() : f => f
		))

  if (!__PROD__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
