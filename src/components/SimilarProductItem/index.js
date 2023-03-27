import './index.css'

const SimilarProductItem = props => {
  const {eachItem} = props

  const {brand, imageUrl, price, rating, title} = eachItem

  return (
    <li className="similar-list-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h1 className="similar-sub-heading">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-price-rating">
        <p className="similar-price">Rs {price}/-</p>
        <div className="rate-star-container">
          <p className="rating-text">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="rating-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
