import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useFormik } from 'formik'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/shared/auth'
import { useHttpClient } from '../../components/shared/http-hook'
import { signupForm } from '../Signup/SignupPage'
import Copyright from '../../components/Copyright'

export default function LoginPage() {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const { sendRequest } = useHttpClient()

  const Login = async (values: signupForm) => {
    try {
      const response = await sendRequest(
        process.env.REACT_APP_LOCAL_BACKEND_URL + '/users/auth',

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
      if (err.message === 'Unauthorized') {
        formik.errors.username = 'Invalid credentials'
      }
    }
  }

  const validate = useCallback((values: signupForm) => {
    const errors: any = {}

    if (!values.password) {
      errors.password = 'Required password'
    }

    if (!values.username) {
      errors.username = 'Required username'
    }

    return errors
  }, [])

  const formik = useFormik<signupForm>({
    initialValues: {
      username: '',
      password: '',
      password2: ''
    },
    validate,
    onSubmit: Login
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
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            inputProps={{ 'data-testid': 'login-username-field' }}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="given-name"
            autoFocus
            onChange={formik.handleChange}
            value={formik.values.username}
          />

          <TextField
            inputProps={{ 'data-testid': 'login-password-field' }}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <div
            className="feedbackloginname"
            data-testid={'feedbackloginname'}
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
            className="feedbackloginpassword"
            data-testid={'feedbackloginpassword'}
            style={{ color: 'red' }}
          >
            {formik.errors.password && (
              <div id="feedback2">
                {formik.errors.password}
                {formik.touched.password}
              </div>
            )}
          </div>

          <Button
            role="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item>
              <Link
                onClick={() => navigate(`/signup`)}
                variant="body2"
                className="hover-link"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  )
}
