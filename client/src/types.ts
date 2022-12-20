export interface IProductDetailsReturn {
  products: {
    stats: {
      products: number
      shops: number
    }
    data: Array<{
      name: string
      price: string
      img: string
      ean: string
      url: string
      shop: string
    }>
  }
}

export interface IProductReviewReturn {
  rating: string
  body: string
  username: string
  userId: number
  productId: string
}
