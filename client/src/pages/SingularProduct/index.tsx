import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useParams } from 'react-router-dom'

import type { IProductDetailsReturn } from '../../types'
import FavoriteButton from '../../components/FavoriteButton'
import { AuthContext } from '../../components/shared/auth'
import ProductTable from './ProductTable'
import Reviews from './Reviews'
import { failureToast } from '../../utils/toasts'

const getProductDetails = async (
  ean: string,
  signal: AbortSignal | undefined
): Promise<IProductDetailsReturn> => {
  const response = await fetch(
    `${process.env.REACT_APP_LOCAL_BACKEND_URL}/products/details/${ean}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal
    }
  )
  const data: IProductDetailsReturn = await response.json()
  return data
}

const SingularProductPage = () => {
  const { pid } = useParams()
  const auth = useContext(AuthContext)

  const [images, setImages] = useState<Array<string>>([])
  const [activeImage, setActiveImage] = useState<number>(0)
  const [productName, setProductName] = useState<string>('')
  const [tabNum, setTabNum] = useState<number>(0)
  const [productTableData, setProductTableData] = useState<
    Array<{ storeName: string; price: string; url: string }>
  >([])
  const controllerRef = useRef<AbortController | null>()
  const [loading, setLoading] = useState<boolean>(true)

  // Get data to display, runs on first render / if useParams cant make it to first render (I have no idea if that is possible or not)
  useEffect(() => {
    let active = true
    try {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
      const controller = new AbortController()
      controllerRef.current = controller
      ;(async () => {
        const product = await getProductDetails(
          pid!,
          controllerRef.current?.signal
        )
        if (active) {
          setImages(() =>
            // Filter out products where there is no image
            product.products.data.filter((e) => e.img !== '').map((e) => e.img)
          )
          setProductName(
            () =>
              // Choose the shortest name to display
              product.products.data.reduce((a, b) =>
                a.name.length > b.name.length ? b : a
              ).name
          )
          setProductTableData(() =>
            product.products.data.map((e) => ({
              storeName: e.shop,
              price: e.price,
              url: e.url
            }))
          )
          setLoading(() => false)
        }
      })()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      failureToast('Something went wrong while fetching item')
    }

    return () => {
      active = false
      controllerRef.current?.abort()
    }
  }, [pid])

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }} maxWidth="md">
      <CssBaseline />
      {/* Main box */}
      {!loading ? (
        <Box
          sx={{
            display: 'flex',
            width: '90%',
            height: '80vh',
            flexDirection: 'column',
            marginTop: '3rem',
            background: '#4d4c7d18',
            padding: '1rem',
            border: '1px solid transparent',
            borderRadius: '1rem'
          }}
        >
          {/* Box for the upper 50% of the main box */}
          <Box
            sx={{
              width: '100%',
              height: '50%',
              display: 'flex'
            }}
          >
            {/* Box for the images */}
            <Box
              sx={{
                width: '60%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                justifyItems: 'center',
                borderRight: 1,
                borderColor: 'divider'
              }}
            >
              {/* Button to display previous image */}
              <IconButton
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
              >
                <ArrowBackIosIcon />
              </IconButton>
              {/* Image */}
              <img
                src={images[activeImage]}
                alt="product"
                style={{
                  objectFit: 'contain',
                  height: '90%',
                  width: '70%',
                  mixBlendMode: 'multiply'
                }}
              ></img>
              {/* Button to display next image */}
              <IconButton
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            {/* Box for the product name & favorite button */}
            <Box
              sx={{
                width: '40%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                justifyItems: 'center',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              {/* Product name */}
              <Typography sx={{ padding: '0.5rem' }}>{productName}</Typography>
              {/* Favorite button */}
              {auth.isLoggedIn && (
                <Box sx={{ top: '0', right: '0.25rem', position: 'absolute' }}>
                  <FavoriteButton
                    ean={pid!}
                    userId={auth.userId}
                    token={auth.token}
                  />
                </Box>
              )}
            </Box>
          </Box>
          {/* Box for the lower 50% of the main box */}
          <Box
            sx={{
              width: '100%',
              height: '50%'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabNum}
                onChange={(event: React.SyntheticEvent, newTabNum: number) =>
                  setTabNum(() => newTabNum)
                }
              >
                <Tab label="Stores" />
                <Tab label="Reviews" />
              </Tabs>
            </Box>
            {tabNum === 0 && <ProductTable data={productTableData} />}
            {tabNum === 1 && (
              <Reviews
                ean={pid!}
                token={auth.isLoggedIn ? auth.token : undefined}
                userId={auth.isLoggedIn ? auth.userId : undefined}
              />
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            width: '90%',
            height: '80vh',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center'
          }}
        >
          <CircularProgress color="primary" size="5rem" />
        </Box>
      )}
    </Container>
  )
}

export default SingularProductPage
