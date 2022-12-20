import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import './style.css'
import Products from './Products'
import Search from './Search'
import Copyright from '../../components/Copyright'

export interface productInformation {
  name: string
  prices: string[]
  shops: string[]
  images: string[]
  urls: string[]
  ean: string
}

export default function HomePage() {
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const query = searchParams.get('q') || ''
    const page = searchParams.get('page') || 1
    setQuery(query)
    setPage(Number(page))
  }, [searchParams])

  return (
    <>
      <CssBaseline />
      <AppBar position="relative"></AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Find products
            </Typography>

            <Search setProducts={setProducts} query={query} />
            <Products products={products} page={page} setPage={setPage} />
          </Container>
        </Box>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  )
}
