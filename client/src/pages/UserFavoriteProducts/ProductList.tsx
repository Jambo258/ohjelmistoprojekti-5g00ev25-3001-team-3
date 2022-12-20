import { Stack, Box } from '@mui/material'

import { Details } from './UserFavoriteProductsPage'
import ProductItem from './ProductItem'

interface Props {
  favorites: Details[]
  getProducts: Function
}

export default function ProductList(props: Props) {
  const { favorites, getProducts } = props
  return (
    <Stack>
      {favorites.map((item, index) => (
        <Box key={index}>
          <ProductItem item={item} getProducts={getProducts} />
        </Box>
      ))}
    </Stack>
  )
}
