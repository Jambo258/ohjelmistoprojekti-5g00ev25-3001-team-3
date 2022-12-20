import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useHttpClient } from '../../components/shared/http-hook'

interface Props {
  setProducts: Function
  query: string
}

function Products(props: Props) {
  const { setProducts, query } = props

  const [searchParams, setSearchParams] = useSearchParams()
  const { isLoading, sendRequest } = useHttpClient()

  //wrap your logic in useCallback hook
  const search = useCallback(
    async (query: string) => {
      if (query.length <= 3) return
      try {
        const response = await sendRequest(
          process.env.REACT_APP_LOCAL_BACKEND_URL + `/products/search/${query}`,
          'GET',
          null,
          {
            'Content-Type': 'application/json'
          }
        )
        setProducts(response.products.data)
      } catch (err) {}
    },
    [sendRequest, setProducts]
  )

  useEffect(() => {
    search(query)
  }, [query, search])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const query: string = data.get('outlined-basic') as string
    setSearchParams(`q=${query}&page=1`)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      textAlign="center"
      sx={{
        '& > :not(style)': { mt: 3, mr: 3, ml: 3, width: '85%' }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        inputProps={{ 'data-testid': 'search-field' }}
        id="outlined-basic"
        name="outlined-basic"
        label="Search"
        variant="outlined"
        placeholder={searchParams.get('q') || ''}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Search{' '}
        {isLoading && (
          <CircularProgress
            data-testid="spinner"
            color="secondary"
            size="20px"
            sx={{ ml: '10px', mt: '-5px' }}
          />
        )}
      </Button>
    </Box>
  )
}

export default Products
