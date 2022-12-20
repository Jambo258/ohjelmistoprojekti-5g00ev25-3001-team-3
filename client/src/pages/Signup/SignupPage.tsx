import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useCallback, useContext } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/shared/auth'
import { useHttpClient } from '../../components/shared/http-hook'
import Copyright from '../../components/Copyright'

export interface signupForm {
  password: string
  username: string
  password2: string
}

export default function SignupPage() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const { sendRequest } = useHttpClient()

  const validate = useCallback((values: signupForm) => {
    const errors: any = {}

    if (!values.password) {
      errors.password = 'Required password'
    } else if (values.password.length < 3) {
      errors.password = 'Password must be atleast 3 characters or more'
    }

    if (!values.username) {
      errors.username = 'Required username'
    }
    if (!values.password2) {
      errors.password2 = 'Required re-enter password'
    } else if (values.password2 !== values.password) {
      errors.password2 = 'Passwords arent same'
    }

    return errors
  }, [])

  const onSubmitHandler = async (values: signupForm) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users`,

        'POST',
        JSON.stringify({
          username: formik.values.username,
          password: formik.values.password
        }),
        {
          'Content-Type': 'application/json'
        }
      )

      auth.login(response.id, response.token, response.role)
      navigate(`/`)
    } catch (err: any) {
      if (err.name === 'Error') {
        formik.errors.username = 'Username already exists'
      }
    }
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputProps={{ 'data-testid': 'username-field' }}
                autoComplete="given-name"
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.username}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                inputProps={{ 'data-testid': 'password-field-1' }}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                inputProps={{ 'data-testid': 'password-field-2' }}
                required
                fullWidth
                name="password2"
                label="Re-enter Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                value={formik.values.password2}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div
                className="feedback1"
                data-testid={'feedback-1'}
                style={{ color: 'red' }}
              >
                {formik.errors.username && (
                  <div id="feedback1">
                    {formik.errors.username}
                    {formik.touched.username}
                  </div>
                )}
              </div>
              <div
                className="feedback2"
                data-testid={'feedback-2'}
                style={{ color: 'red' }}
              >
                {formik.errors.password && (
                  <div id="feedback2">{formik.errors.password}</div>
                )}
              </div>

              <div
                className="feedback3"
                data-testid={'feedback-3'}
                style={{ color: 'red' }}
              >
                {formik.errors.password2 && (
                  <div id="feedback3">{formik.errors.password2}</div>
                )}
              </div>
            </Grid>
          </Grid>
          <Button
            role="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link
                onClick={() => navigate(`/login`)}
                variant="body2"
                className="hover-link"
              >
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  )
}
