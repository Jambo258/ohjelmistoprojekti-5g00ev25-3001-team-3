import { useState } from 'react'

import ReviewEdit from './ReviewEdit'
import ReviewView from './ReviewView'

interface IReviewProps {
  ean: string
  token: string
  userId: number
}

const Reviews = ({ ean, token, userId }: IReviewProps) => {
  const [mode, setMode] = useState<'edit' | 'view'>('view')

  return (
    <>
      {mode === 'view' ? (
        <ReviewView
          changeMode={(mode: 'edit' | 'view') => setMode(() => mode)}
          ean={ean}
          userId={userId}
        />
      ) : (
        <ReviewEdit
          changeMode={(mode: 'edit' | 'view') => setMode(() => mode)}
          token={token}
          ean={ean}
        />
      )}
    </>
  )
}

export default Reviews
