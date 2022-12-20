import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useEffect, useState } from 'react'

interface IFavoriteButtonProps {
  ean: string
  userId: number
  token: string
}

const FavoriteButton = ({ ean, userId, token }: IFavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const setFavorite = async () => {
    try {
      setLoading(true)
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
      if (!isFavorite) {
        const favoriteResponse = await fetch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/list`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              productId: ean,
              userId: userId
            })
          }
        )
        if (favoriteResponse.status !== 201) {
          throw new Error('Error adding item to list')
        }
      } else {
        const unFavoriteResponse = await fetch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/list`,
          {
            method: 'DELETE',
            headers,
            body: JSON.stringify({
              ean,
              userId: userId
            })
          }
        )
        if (unFavoriteResponse.status !== 200) {
          throw new Error('Error deleting item from the list')
        }
      }
      setIsFavorite((prev) => !prev)
      setLoading(() => false)
    } catch (error) {}
  }

  useEffect(() => {
    let active = true
    ;(async (): Promise<void> => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/list/${userId}`
        )
        const data: Array<{ ean: string }> = await response.json()

        const isInList = data.map((e) => e.ean).includes(ean)

        if (active) {
          setLoading(() => false)
          setIsFavorite(() => isInList)
        }
      } catch (error) {}
    })()
    return () => {
      active = false
    }
  }, [userId, ean])

  return (
    <IconButton disabled={loading} onClick={() => setFavorite()}>
      {isFavorite ? (
        <FavoriteIcon
          sx={{ fontSize: '2rem', color: loading ? 'gray' : 'pink' }}
        />
      ) : (
        <FavoriteBorderIcon
          sx={{ fontSize: '2rem', color: loading ? 'gray' : 'pink' }}
        />
      )}
    </IconButton>
  )
}

export default FavoriteButton
