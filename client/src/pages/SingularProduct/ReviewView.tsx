import {
  TableContainer,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Rating,
  Button
} from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'

import { IProductReviewReturn } from '../../types'
import { AuthContext } from '../../components/shared/auth'

interface IReviewViewProps {
  changeMode: (mode: 'edit' | 'view') => void
  ean: string
  userId: number
}

const ReviewView = (props: IReviewViewProps) => {
  const [reviews, setReviews] = useState<Array<IProductReviewReturn>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const controllerRef = useRef<AbortController | null>()
  const auth = useContext(AuthContext)

  useEffect(() => {
    let active = true
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    const controller = new AbortController()
    controllerRef.current = controller
    ;(async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/reviews/${props.ean}`,
          {
            signal: controllerRef.current?.signal
          }
        )
        const data: Array<IProductReviewReturn> = await response.json()
        if (active) {
          setReviews(data)
          setLoading(() => false)
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
      }
    })()

    return () => {
      active = false
      controllerRef.current?.abort()
    }
  }, [props.ean])

  return loading ? (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'center'
      }}
    >
      <CircularProgress
        color="primary"
        size="3rem"
        sx={{ marginBottom: '3rem' }}
      />
    </Box>
  ) : reviews.length === 0 ? (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'center',
        position: 'relative'
      }}
    >
      <Typography>No reviews to show 😢</Typography>
      {auth.isLoggedIn && (
        <Button
          sx={{ position: 'absolute', bottom: '0', right: '0' }}
          onClick={() => props.changeMode('edit')}
        >
          Give review
        </Button>
      )}
    </Box>
  ) : (
    <Box sx={{ position: 'relative', height: '90%' }}>
      <>
        <TableContainer component={Box} style={{ maxHeight: '90%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '100%', fontWeight: '700' }}>
                  Review
                </TableCell>
                <TableCell style={{ width: '40%', fontWeight: '700' }}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((e) => (
                <TableRow key={e.userId}>
                  <TableCell>
                    <Box>
                      <Typography>{e.body}</Typography>
                      <Typography>- {e.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Rating
                      name="simple-controlled"
                      value={parseInt(e.rating)}
                      readOnly
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {auth.isLoggedIn &&
          !reviews.map((e) => e.userId).includes(props.userId) && (
            <Button
              sx={{ position: 'absolute', bottom: '0', right: '0' }}
              onClick={() => props.changeMode('edit')}
            >
              Give review
            </Button>
          )}
      </>
    </Box>
  )
}

export default ReviewView
