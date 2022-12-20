import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SignupPage from './SignupPage'
import userEvent from '@testing-library/user-event'

describe('Signup Page tests', () => {
  it('should show Signup button on the page', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('should show Login instead button on the page', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    // expect(screen.getByText('Already have an account? Log in')).toHaveAttribute(
    //   'href',
    //   '/login'
    // )
  })

  it('should show textfield for username on the page', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should show textfield for password and re-enter password on the page', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('Re-enter Password')).toBeInTheDocument()
  })

  it('should show errors on password field', async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('password-field-1'), '1')
    expect(
      await screen.findByText('Password must be atleast 3 characters or more')
    ).toBeVisible()
  })

  it('should show errors on username field when no username is given', async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('password-field-1'), '123')

    expect(await screen.findByText('Required username')).toBeVisible()
  })

  it('should show errors when password and re-enter password doesnt match', async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('password-field-1'), '123')
    userEvent.type(screen.getByTestId('password-field-2'), '1234')
    expect(await screen.findByText('Passwords arent same')).toBeVisible()
  })

  it('should show errors on password field when no password is given', async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('username-field'), 'user')

    expect(await screen.findByText('Required password')).toBeVisible()
    expect(await screen.findByText('Required re-enter password')).toBeVisible()
  })
})
