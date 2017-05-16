import React from 'react'

export const Counter = ({ startup }) => (
  <div style={{ margin: '0 auto' }} >
    <button className='btn btn-default' onClick={startup}>
      Startup
    </button>
  </div>
)

export default Counter
