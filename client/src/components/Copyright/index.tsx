import { Box, Link, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function Copyright() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      color="text.secondary"
    >
      <Typography variant="body2" align="center">
        <Link
          color="inherit"
          href="https://gitlab.tamk.cloud/ollanon/ohjelmistoprojekti-5g00ev25-3001"
        >
          Source code
        </Link>{' '}
      </Typography>
      &nbsp;
      <GitHubIcon />
    </Box>
  )
}
