import Pagination from '@mui/material/Pagination'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useSearchParams } from 'react-router-dom'

import ProductCard from './ProductCard'
import { productInformation } from './index'

const ITEMS_IN_PAGE = 10

interface Props {
  products: productInformation[]
  page: number
  setPage: Function
}

function Products(props: Props) {
  const { products, page, setPage } = props
  const [searchParams, setSearchParams] = useSearchParams()

  function calculatePageCount(): number {
    const count = products.length / ITEMS_IN_PAGE
    if (String(count).includes('.')) {
      return Number(String(count + 1).split('.')[0])
    }
    return count
  }

  function isInPage(index: number): boolean {
    if (index >= (page - 1) * ITEMS_IN_PAGE && index <= page * ITEMS_IN_PAGE) {
      return true
    }
    return false
  }

  const pageUrl = (n: number) => {
    setPage(n)
    searchParams.set('page', n.toString())
    setSearchParams(searchParams)
  }

  return (
    <Box className="home-products">
      <Grid container spacing={4}>
        {products.map(
          (product: productInformation, index: number) =>
            isInPage(index) && (
              <ProductCard product={product} key={`${index}_${product.ean}`} />
            )
        )}
      </Grid>
      {products.length > 0 && (
        <Stack alignItems="center">
          <Pagination
            page={page}
            count={calculatePageCount()}
            onChange={(event, page) => pageUrl(page)}
            sx={{ mt: 3, textAlign: 'center' }}
          />
        </Stack>
      )}
    </Box>
  )
}

export default Products
