import React from 'react'
import DuckImage from './assets/Duck.jpg'
import s from './ProductsStyles.scss'

export const Products = () => (
  <div>
    <h4>Welcome!</h4>
    <img
      alt='This is a duck, because Redux!'
      className={s.duck}
      src={DuckImage} />
  </div>
)

export default Products
