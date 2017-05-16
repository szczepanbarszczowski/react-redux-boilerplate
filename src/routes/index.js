import AppLayout from 'layouts/CoreLayout'
import ProductsRoute from './ProductsRoute'
import CounterRoute from './CounterRoute'
import NotFoundRoute from './NotFoundRoute'

// Possibility to pass the store to routes: HelloRoute(store)
export default (store) => ({ // eslint-disable-line
  path: '/',
  component: AppLayout,
  indexRoute: ProductsRoute(),
  childRoutes: [
    CounterRoute(),
    NotFoundRoute() // this route must be at end because (path: '*').
  ]
})
