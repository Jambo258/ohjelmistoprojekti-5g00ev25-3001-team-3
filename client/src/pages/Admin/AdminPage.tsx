import { useCallback, useContext, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import { AuthContext } from '../../components/shared/auth'
import { useHttpClient } from '../../components/shared/http-hook'
import { failureToast, successToast } from '../../utils/toasts'

export interface Data {
  data: any[]
  changeUsers: React.Dispatch<React.SetStateAction<any[]>>
}

export interface UserDetails {
  id: number
  username: string
  password: string
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))
export default function AdminPage(props: Data) {
  const [IdNumber, setIdNumber] = useState<any>()
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const auth = useContext(AuthContext)
  const { sendRequest } = useHttpClient()

  const resetValues = () => {
    formik2.values.username = ''
    formik.values.password = ''
  }

  const handleClickOpen = (id: number) => {
    setIdNumber(id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen1 = (id: number) => {
    setIdNumber(id)
    setOpen1(true)
  }

  const handleClose1 = () => {
    setOpen1(false)
  }

  const handleClickOpen2 = (id: number) => {
    setIdNumber(id)
    setOpen2(true)
  }

  const handleClose2 = () => {
    setOpen2(false)
  }

  const validate = useCallback((values: UserDetails) => {
    const errors: any = {}

    if (!values.username) {
      errors.username = 'Required username'
    }

    return errors
  }, [])

  const validate1 = useCallback((values: UserDetails) => {
    const errors: any = {}

    if (!values.password) {
      errors.password = 'Required new password'
    } else if (values.password.length < 3) {
      errors.password = 'Password must be atleast 3 characters or more'
    }

    return errors
  }, [])

  const updatePassword = async (values: UserDetails) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users`,

        'PATCH',
        JSON.stringify({
          id: IdNumber,
          password: formik.values.password,
          role: null,
          username: null
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )

      successToast('Success!')
      handleClose()
    } catch (err) {
      failureToast('Something went wrong')
    }
  }

  const updateUsername = async (values: UserDetails) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users`,

        'PATCH',
        JSON.stringify({
          id: IdNumber,
          password: null,
          role: null,
          username: formik2.values.username
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.changeUsers((prev) => {
        const users = prev.filter((e) => e.id !== IdNumber)
        const modify = prev.find((e) => e.id === IdNumber)
        return [...users, { ...modify, username: formik2.values.username }]
      })
      successToast('Success!')
      handleClose1()
    } catch (err) {
      failureToast('Something went wrong')
    }
  }

  const formik = useFormik<UserDetails>({
    initialValues: {
      username: '',
      password: '',
      id: 0
    },
    validate: validate1,
    onSubmit: updatePassword
  })

  const formik2 = useFormik<UserDetails>({
    initialValues: {
      username: '',
      password: '',
      id: 0
    },
    validate,
    onSubmit: updateUsername
  })

  const deleteUser = async (id: number) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users/${id}`,
        'DELETE',
        null, // No body

        { Authorization: 'Bearer ' + auth.token }
      )
      props.changeUsers((prev) => prev.filter((e) => e.id !== id))
      successToast('Successfully deleted user')
    } catch (err) {
      failureToast('Deleting user failed')
    }
  }

  return (
    <>
      <CssBaseline />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell data-testid={'adminpage-id'}>Id</StyledTableCell>
              <StyledTableCell data-testid={'adminpage-username'} align="right">
                Username
              </StyledTableCell>
              <StyledTableCell data-testid={'adminpage-role'} align="right">
                Role
              </StyledTableCell>
              <StyledTableCell
                data-testid={'adminpage-functions'}
                align="center"
              >
                Functions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map(
              (
                user: {
                  id: number
                  role: string
                  username: string
                },
                index: number
              ) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {user.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {user.username}
                  </StyledTableCell>
                  <StyledTableCell align="right">{user.role}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      data-testid="delete-user"
                      size="small"
                      onClick={() => {
                        handleClickOpen2(user.id)
                      }}
                    >
                      Delete User
                    </Button>
                    <Dialog
                      open={open2}
                      onClose={handleClose2}
                      aria-labelledby="alert-dialog-title3"
                      aria-describedby="alert-dialog-description3"
                    >
                      <DialogTitle id="alert-dialog-title3">
                        Are you sure you want to delete user id: {IdNumber}
                      </DialogTitle>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            handleClose2()
                          }}
                        >
                          No
                        </Button>
                        <Button
                          onClick={() => {
                            handleClose2()
                            deleteUser(IdNumber)
                          }}
                          autoFocus
                        >
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Button
                      data-testid="change-username"
                      size="small"
                      onClick={() => {
                        handleClickOpen1(user.id)
                      }}
                    >
                      Change Username
                    </Button>
                    <Dialog
                      maxWidth="sm"
                      open={open1}
                      aria-labelledby="alert-dialog-title2"
                      aria-describedby="alert-dialog-description2"
                      onClose={(event, reason) => {
                        if (
                          reason !== 'backdropClick' &&
                          reason !== 'escapeKeyDown'
                        ) {
                          setOpen1(false)
                        }
                      }}
                    >
                      <Box
                        component="form"
                        noValidate
                        onSubmit={formik2.handleSubmit}
                        sx={{ mt: 3 }}
                      >
                        <DialogTitle id="alert-dialog-title2">
                          Change username for user id: {IdNumber}
                          <TextField
                            inputProps={{ 'data-testid': 'username-by-admin' }}
                            autoComplete="given-name"
                            name="username"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoFocus
                            onBlur={formik2.handleBlur}
                            onChange={formik2.handleChange}
                            value={formik2.values.username}
                          />
                          <label style={{ color: 'red' }}>
                            {formik2.errors.username}
                          </label>
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              handleClose1()
                              resetValues()
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            role="button"
                            type="submit"
                            data-testid="change-username-confirm"
                          >
                            Change Username
                          </Button>
                        </DialogActions>
                      </Box>
                    </Dialog>

                    <Button
                      data-testid="change-password"
                      size="small"
                      onClick={() => {
                        handleClickOpen(user.id)
                      }}
                    >
                      Change User Password
                    </Button>

                    <Dialog
                      maxWidth="sm"
                      open={open}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      onClose={(event, reason) => {
                        if (
                          reason !== 'backdropClick' &&
                          reason !== 'escapeKeyDown'
                        ) {
                          setOpen(false)
                        }
                      }}
                    >
                      <Box
                        component="form"
                        noValidate
                        onSubmit={formik.handleSubmit}
                        sx={{ mt: 3 }}
                      >
                        <DialogTitle id="alert-dialog-title">
                          Change password for user id: {IdNumber}
                          <TextField
                            inputProps={{ 'data-testid': 'password-by-admin' }}
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                          />
                          <label style={{ color: 'red' }}>
                            {formik.errors.password}
                          </label>
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              handleClose()
                              resetValues()
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            role="button"
                            type="submit"
                            data-testid="change-password-confirm"
                          >
                            Change Password
                          </Button>
                        </DialogActions>
                      </Box>
                    </Dialog>
                  </StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
