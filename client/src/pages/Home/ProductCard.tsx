import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
// import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EuroIcon from '@mui/icons-material/Euro'
import { useNavigate } from 'react-router-dom'

import { productInformation } from './index'
import lowestPrice from '../../components/shared/lowestPrice'

interface Props {
  product: productInformation
}

function ProductCard(props: Props) {
  const { product } = props

  let navigate = useNavigate()

  const routeChange = (product: productInformation) => {
    navigate(`singularproductpage/${product.ean}`, {
      state: {
        product
      }
    })
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          // height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '5px',
          bgcolor: '#4d4c7d18'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <div className="product-image-box">
            <img src={product.images[0]} alt="" className="product-image" />
          </div>
          <Typography
            component="p"
            color="text.secondary"
            sx={{ marginBottom: '5px' }}
          >
            {product.name.toUpperCase()}
          </Typography>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <EuroIcon />
            <Typography
              gutterBottom
              variant="h6"
              component="h2"
              sx={{
                marginLeft: '10px',
                marginBottom: '-1.5px'
              }}
            >
              {lowestPrice(product.prices)} {'<'}
            </Typography>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: '2px'
            }}
          >
            <ShoppingCartIcon />
            <Typography
              variant="h6"
              component="h2"
              sx={{
                marginLeft: '10px'
                // marginBottom: '-5px'
              }}
            >
              {product.shops.length}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => routeChange(product)}
          >
            Look stores
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default ProductCard
