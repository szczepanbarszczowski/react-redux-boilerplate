import { connect } from 'react-redux'
import Counter from './Counter'

import {
  startup
} from 'redux/actions/commonActions'

const mapDispatchToProps = {
  startup
}

const mapStateToProps = (state) => ({
  counter : state.counter
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
