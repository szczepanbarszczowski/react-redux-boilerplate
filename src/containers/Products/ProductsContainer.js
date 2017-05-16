import ProductsView from './Products'
import { pure, compose } from 'recompose'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
}

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure
)

export default enhance(ProductsView)
