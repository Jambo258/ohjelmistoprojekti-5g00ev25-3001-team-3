import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { AuthContext } from '../../components/shared/auth'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'

import ProductList from './ProductList'
import { productInformation } from '../Home'

import './style.css'
import { Box } from '@mui/material'

export interface Details {
  stats: Stats
  data: productInformation[]
}

interface Stats {
  products: Number
  shops: Number
}

export default function UserFavoriteProductsPage() {
  const auth = useContext(AuthContext)
  const [favorites, setFavorites] = useState<Details[]>([])
  const [loaded, setLoaded] = useState(true)
  const controllerRef = useRef<AbortController | null>()

  const getDetails = async (ean: string) => {
    const res = await fetch(
      `${process.env.REACT_APP_LOCAL_BACKEND_URL}/products/search/${ean}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const jsonResponse = await res.json()
    const details: Details = jsonResponse.products
    return details
  }

  const getProducts = useCallback(async () => {
    setLoaded(true)
    setFavorites([])
    try {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }

      const abortController = new AbortController()
      controllerRef.current = abortController

      const userId = auth.userId
      const signal = controllerRef.current?.signal

      const res = await fetch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/list/${userId}`,
        {
          method: 'GET',
          signal,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const eanList: Array<{ ean: string }> = await res.json()

      const items: Array<Details> = await Promise.all(
        eanList.map(async ({ ean }) => getDetails(ean))
      )

      setFavorites(items)
      setLoaded(false)
    } catch (error) {
      console.error(error)
    }
  }, [auth])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" className="main-card-favorite">
        {loaded ? (
          <Box className="spinner">
            <CircularProgress
              data-testid="spinner"
              color="primary"
              size="30px"
            />
          </Box>
        ) : (
          <ProductList favorites={favorites} getProducts={getProducts} />
        )}
      </Container>
    </>
  )
}
