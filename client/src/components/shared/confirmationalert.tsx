import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useContext, useState } from 'react'

import { AuthContext } from './auth'
import { useHttpClient } from './http-hook'
import { useNavigate } from 'react-router-dom'
import { ProfileData } from '../../pages/Profile/ProfilePage'

export default function ConfirmationAlert(props: ProfileData) {
  const [open, setOpen] = useState(false)

  const auth = useContext(AuthContext)
  const { sendRequest } = useHttpClient()

  //const { id } = useParams()

  const navigate = useNavigate()

  const routeChange = () => {
    navigate('/')
  }

  const deleteUser = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users/${props.id}`,
        'DELETE',
        null, // No body

        { Authorization: 'Bearer ' + auth.token }
      )
    } catch (err) {}

    if (auth.role !== 'admin') {
      auth.logout()
      routeChange()
    } else if (auth.role === 'admin') {
      routeChange()
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        size="small"
        onClick={handleClickOpen}
      >
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete account?'}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose()
            }}
          >
            No
          </Button>
          <Button
            data-testid="confirm"
            onClick={() => {
              handleClose()
              deleteUser()
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
