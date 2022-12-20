import {
  Table,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'

interface IProductTableProps {
  data: Array<{
    storeName: string
    price: string
    url: string
  }>
}

const ProductTable = (props: IProductTableProps) => {
  return (
    <TableContainer component={Box} style={{ maxHeight: '90%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '50%', fontWeight: '700' }}>
              Store
            </TableCell>
            <TableCell style={{ width: '40%', fontWeight: '700' }}>
              Price
            </TableCell>
            <TableCell style={{ fontWeight: '700' }}>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((e) => (
            <TableRow key={e.storeName}>
              <TableCell>{e.storeName}</TableCell>
              <TableCell>{e.price}</TableCell>
              <TableCell>
                <IconButton onClick={() => window.open(e.url)}>
                  <LocalGroceryStoreIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductTable
