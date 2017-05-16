export default () => ({
  getComponent: async (location, cb) => {
    const component = await System.import('containers/Products/ProductsContainer')
    cb(null, component.default)
  }
})
