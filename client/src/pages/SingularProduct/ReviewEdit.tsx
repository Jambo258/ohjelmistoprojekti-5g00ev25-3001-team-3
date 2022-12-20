import {
  Box,
  Button,
  IconButton,
  Rating,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { failureToast, successToast } from '../../utils/toasts'

interface IReviewEditrops {
  changeMode: (mode: 'edit' | 'view') => void
  token: string
  ean: string
}

const ReviewEdit = (props: IReviewEditrops) => {
  const [value, setValue] = useState<string>('')
  const [rating, setRating] = useState<number | null>(null)

  const sendReview = async (
    rating: number | null,
    body: string,
    ean: string
  ) => {
    if (rating === null) {
      failureToast('You must choose a rating!')
      return
    }
    if (body === '') {
      failureToast('Do not send empty reviews!')
      return
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token
          },
          body: JSON.stringify({
            body,
            rating: rating.toString(),
            productId: ean
          })
        }
      )
      if (response.status !== 201) {
        throw new Error('Error sending review')
      }
      successToast('Review sent')
      props.changeMode('view')
    } catch (error) {
      failureToast('Something went wrong, review not sent')
    }
  }

  return (
    <Box
      component={'form'}
      noValidate
      autoComplete="off"
      sx={{
        width: '100%',
        height: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ width: '95%', display: 'flex', marginBottom: '0.25rem' }}>
        <Typography>{'Your review here!'}</Typography>
      </Box>
      <TextField
        id="comment"
        multiline
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(() => event.target.value)
        }
        sx={{ width: '95%' }}
        minRows={5}
      ></TextField>
      <Box
        sx={{
          display: 'flex',
          width: '95%',
          justifyContent: 'space-between',
          marginTop: '0.25rem'
        }}
      >
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(() => newValue)}
        ></Rating>
        <Button onClick={() => sendReview(rating, value, props.ean)}>
          Send Review
        </Button>
      </Box>
      <IconButton
        onClick={() => props.changeMode('view')}
        sx={{ position: 'absolute', bottom: '0', left: '0.25rem' }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  )
}

export default ReviewEdit
