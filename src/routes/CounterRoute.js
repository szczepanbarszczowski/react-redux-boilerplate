export default () => ({
  path: 'counter',
  getComponent: async (location, cb) => {
    const component = await System.import('containers/Counter/CounterContainer')
    cb(null, component.default)
  }
})
