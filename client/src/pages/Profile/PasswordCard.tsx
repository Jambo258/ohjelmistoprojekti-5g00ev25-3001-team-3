import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useCallback, useContext } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/shared/auth'
import { useHttpClient } from '../../components/shared/http-hook'
import { signupForm } from '../Signup/SignupPage'

export default function PasswordCard() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const { sendRequest } = useHttpClient()

  const validate = useCallback((values: signupForm) => {
    const errors: any = {}

    if (!values.password) {
      errors.password = 'Required new password'
    } else if (values.password.length < 3) {
      errors.password = 'Password must be atleast 3 characters or more'
    }

    if (!values.password2) {
      errors.password2 = 'Required re-enter new password'
    } else if (values.password2 !== values.password) {
      errors.password2 = 'Passwords arent same'
    }
    return errors
  }, [])

  const onSubmitHandler = async (values: signupForm) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users`,

        'PATCH',
        JSON.stringify({
          id: auth.userId,
          password: formik.values.password2,
          role: null,
          username: null
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )

      navigate(`/`)
    } catch (err) {}
  }

  const formik = useFormik<signupForm>({
    initialValues: {
      username: '',
      password: '',
      password2: ''
    },
    validate,
    onSubmit: onSubmitHandler
  })

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      sx={{ mt: 3, p: '1em' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            inputProps={{ 'data-testid': 'new-password-field' }}
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="password-field"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            inputProps={{ 'data-testid': 're-enter-password-field' }}
            required
            fullWidth
            name="password2"
            label="Re-Enter New Password"
            type="password"
            id="password2"
            autoComplete="new-password"
            value={formik.values.password2}
            onChange={formik.handleChange}
            className="password-field"
          />
        </Grid>
        <Box sx={{ ml: '1em', mt: '10px' }}>
          <Box
            className="feedbackpasswordchange"
            data-testid={'feedback-password-change'}
            style={{ color: 'red' }}
          >
            {formik.errors.password && (
              <div id="feedbackpasswordchange">{formik.errors.password}</div>
            )}
          </Box>
          <Box
            className="feedbackpasswordchange2"
            data-testid={'feedback-password-change-2'}
            style={{ color: 'red' }}
          >
            {formik.errors.password2 && (
              <div id="feedbackpasswordchange2">{formik.errors.password2}</div>
            )}
          </Box>
        </Box>
      </Grid>
      <Button
        role="button"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Change Password
      </Button>
      <Grid container justifyContent="flex-end"></Grid>
    </Box>
  )
}
