import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarDetails: [],
    apiStatus: apiStatusConst.initial,
    cartCount: 1,
  }

  componentDidMount = () => {
    this.getEachProductDetails()
  }

  successDetails = async response => {
    const fetchedData = await response.json()

    const formateData = {
      availability: fetchedData.availability,
      brand: fetchedData.brand,
      description: fetchedData.description,
      id: fetchedData.id,
      imageUrl: fetchedData.image_url,
      price: fetchedData.price,
      rating: fetchedData.rating,
      style: fetchedData.style,
      title: fetchedData.title,
      totalReviews: fetchedData.total_reviews,
    }

    const formateSimilarProducts = fetchedData.similar_products.map(
      eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }),
    )

    this.setState({
      productItemDetails: formateData,
      similarDetails: formateSimilarProducts,
      apiStatus: apiStatusConst.success,
    })
  }

  getEachProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConst.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      this.successDetails(response)
    } else {
      this.setState({
        apiStatus: apiStatusConst.failure,
      })
    }
  }

  onDecreaseCart = () => {
    const {cartCount} = this.state
    if (cartCount > 1) {
      this.setState(prevState => ({
        cartCount: prevState.cartCount - 1,
      }))
    }
  }

  onIncreaseCart = () => {
    this.setState(prevState => ({
      cartCount: prevState.cartCount + 1,
    }))
  }

  successView = () => {
    const {productItemDetails, similarDetails, cartCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemDetails

    return (
      <div className="success-view-container">
        <div className="product-details">
          <img src={imageUrl} alt="product" className="main-product-img" />
          <div className="product-details-text">
            <h1 className="product-heading">{title}</h1>
            <p className="rs-text">Rs {price}/-</p>
            <div className="rating-reviews-container">
              <div className="rate-star-container">
                <p className="rating-text">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="rating-star"
                />
              </div>
              <p className="reviews-text">{totalReviews} Reviews</p>
            </div>
            <p className="product-description-text">{description}</p>
            <p className="availability">
              Available:
              <span className="stock-text"> {availability}</span>
            </p>
            <p className="availability">
              Brand:
              <span className="stock-text"> {brand}</span>
            </p>
            <hr className="hr-line" />
            <div className="buttons-container">
              <button
                data-testid="minus"
                onClick={this.onDecreaseCart}
                type="button"
                className="button-dash"
              >
                <BsDashSquare className="bs-dash" />
              </button>
              <p className="cart-number">{cartCount}</p>
              <button
                data-testid="plus"
                onClick={this.onIncreaseCart}
                type="button"
                className="button-dash"
              >
                <BsPlusSquare className="bs-dash" />
              </button>
            </div>
            <button type="button" className="add-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-ul-container">
            {similarDetails.map(eachItem => (
              <SimilarProductItem key={eachItem.id} eachItem={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  loadingStatus = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  switchFuncSuccessFailureLoading = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConst.inProgress:
        return this.loadingStatus()
      case apiStatusConst.success:
        return this.successView()
      case apiStatusConst.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.switchFuncSuccessFailureLoading()}
      </>
    )
  }
}

export default ProductItemDetails
