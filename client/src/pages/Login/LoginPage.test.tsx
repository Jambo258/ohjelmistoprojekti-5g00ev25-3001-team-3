import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'

describe('Login Page tests', () => {
  it('should show Username textfield on page', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should show Log In button on page', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
  })

  it('should show invalid credentials when giving false username & password', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
  })

  it('should show errors when no username is given', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('login-password-field'), '123')
    userEvent.click(screen.getByRole('button', { name: 'Log In' }))
    expect(await screen.findByText('Required username')).toBeVisible()
  })

  it('should show errors when no password is given', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    userEvent.type(screen.getByTestId('login-username-field'), 'user')
    userEvent.click(screen.getByRole('button', { name: 'Log In' }))
    expect(await screen.findByText('Required password')).toBeVisible()
  })
})
