import ConfirmationAlert from '../../components/shared/confirmationalert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
  id: number
}

export default function DetailsCard(props: Props) {
  const [user, setUser] = useState<any[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users/${props.id}`
        )
        const data = await response.json()

        setUser(data.username)
      } catch (err) {}
    }
    fetchUser()
  }, [props.id])

  const { id } = props

  return (
    <Stack direction="row" justifyContent="center">
      <Box className="left-box">
        <Avatar
          sx={{
            m: 1,
            ml: 3,
            bgcolor: 'primary.main',
            width: 90,
            height: 90
          }}
        ></Avatar>
        <Typography variant="body2" color="text.secondary" align="center">
          {user}
        </Typography>
        <ConfirmationAlert id={id} />
      </Box>
    </Stack>
  )
}
