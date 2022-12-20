export interface IReview {
  rating: '0' | '1' | '2' | '3' | '4' | '5'
  body: string
  username: string
  userId: number
  productId: string
}
