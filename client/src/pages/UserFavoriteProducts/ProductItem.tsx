import { Grid, Box, Typography, Button } from '@mui/material'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { AuthContext } from '../../components/shared/auth'
import { useHttpClient } from '../../components/shared/http-hook'
import { Details } from './UserFavoriteProductsPage'
import lowestPrice from '../../components/shared/lowestPrice'
import { productInformation } from '../Home'

interface Props {
  item: Details
  getProducts: Function
}

export default function ProductItem(props: Props) {
  const { item, getProducts } = props

  const { sendRequest } = useHttpClient()
  let navigate = useNavigate()
  const auth = useContext(AuthContext)

  const routeChange = (product: productInformation) => {
    navigate(`../singularproductpage/${product.ean}`, {
      replace: true,
      state: {
        product
      }
    })
  }

  const deleteFavorite = async (ean: string) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/list`,
        'DELETE',
        JSON.stringify({
          ean: ean,
          userId: auth.userId
        }),

        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )

      getProducts()
    } catch (err) {}
  }

  function ProductDetails() {
    if (item.data) {
      if (item.data.length > 0) {
        return (
          <Box className="wrap-product">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} md={2}>
                <div className="product-image-box">
                  <img
                    src={item.data[0].images[0]}
                    alt=""
                    className="product-image"
                  />
                </div>
              </Grid>
              <Grid item xs={7} md={5}>
                <Typography>{item.data[0].name.toUpperCase()}</Typography>
              </Grid>
              <Grid item xs={4} md={2}>
                <Typography variant="body1">
                  <b>
                    {lowestPrice(item.data[0].prices)} € {'<'}
                  </b>
                </Typography>
              </Grid>
              <Grid item xs={4} md={2}>
                <Button
                  size="small"
                  type="button"
                  variant="contained"
                  sx={{ fontSize: '11px' }}
                  onClick={() => routeChange(item.data[0])}
                >
                  <Typography sx={{ fontSize: '15px' }}>
                    <b>{item.data[0].shops.length}</b>
                  </Typography>
                  <ShoppingCartIcon
                    sx={{ ml: '7px', width: '20px', height: '20px' }}
                  />
                </Button>
              </Grid>
              <Grid item xs={2} md={1}>
                <Button
                  size="small"
                  type="button"
                  variant="contained"
                  onClick={() => deleteFavorite(item.data[0].ean)}
                >
                  <DeleteOutlineIcon sx={{ width: '20px', height: '20px' }} />
                </Button>
              </Grid>
            </Grid>
            <hr />
          </Box>
        )
      }
    }
    return <></>
  }

  return (
    <Box>
      <ProductDetails />
    </Box>
  )
}
