import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import CssBaseline from '@mui/material/CssBaseline'

import DerailsCard from './DetailsCard'
import PasswordCard from './PasswordCard'

import './style.css'

export interface ProfileData {
  id: number
}

export default function ProfilePage(props: ProfileData) {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" className="main-card">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={5}>
            <DerailsCard id={props.id} />
          </Grid>

          <Grid item xs={12} sm={5} md={5}>
            <PasswordCard />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
