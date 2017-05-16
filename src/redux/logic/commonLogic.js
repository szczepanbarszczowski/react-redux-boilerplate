import { createLogic } from 'redux-logic'

import {
	STARTUP
} from '../actions/commonActions'

const debug = require('debug')('app:commonLogic')

export const startup = createLogic({
	type: STARTUP,
	latest: true, // take latest only

	process ({}, dispatch, done) {
		try {
		  console.log('commonLogic')
		  // dispatch(getUserFromLocalStorageAttempt())
			done()
		} catch (err) {
			debug(err)
		}
	}
})

export default [
	startup
]
