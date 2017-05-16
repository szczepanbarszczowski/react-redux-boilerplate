// @flow
import { createLogic } from 'redux-logic'
import R from 'ramda'

const debug = require('debug')('app:services/helpers')

export const isClient = !global && typeof window === 'object'

type logicHelperTypes = [
	{
		type: string,
		path: string
	}
	]

export const apiGetLogicHelper = (data: logicHelperTypes) => {
	return data.map(({type, path}) => createLogic({
			type,
			latest: true, // take latest only

			async process ({httpClient, action: {params, id, responseSuccess, responseFailure}}, dispatch, done) {
				debug(`start fetching ${path}`)
				try {
					const {res, err} = await httpClient(path + (id ? `/${id}` : ''), {
						method: 'GET',
						query: params
					})
					debug(`finish fetching ${path}/${id ? id : '' }`, res, err)
					if (res) {
						dispatch(responseSuccess(res))
					} else {
						dispatch(responseFailure(err))
					}
					done()
				} catch (err) {
					debug(err)
				}
			}
		})
	)
}

export const reducerHelper = (actions: [string]) => {
	return R.mergeAll(actions.map(action => {
			const parsedString = action.split('_')
			const actionType = parsedString[parsedString.length - 1]
			const nameArray = parsedString.splice(1, parsedString.length - 2)

			const name = nameArray.map((word, index) => {
			  const lowercase = word.toLowerCase()
				if (!index) {
					return lowercase
				}
				return lowercase.charAt(0).toUpperCase() + lowercase.slice(1)
			}).join('')

			switch (actionType) {
				case 'ATTEMPT':
					return {
						[action]: () => ({
							[`${name}Loading`]: true
						}),
					}
				case 'SUCCESS':
					return {
						[action]: (state, {data}) => ({
							[`${name}Loading`]: false,
							[name]: data,
							error: null
						}),
					}
				case 'FAILURE':
					return {
						[action]: (state, {error}) => ({
							[`${name}Loading`]: false,
							error
						}),
					}
				default:
					return {}
			}
		})
	)
}
