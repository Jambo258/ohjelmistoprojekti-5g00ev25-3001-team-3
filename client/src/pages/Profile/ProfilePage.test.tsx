import { render, screen } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import ProfilePage from './ProfilePage'
import userEvent from '@testing-library/user-event'

describe('Profile Page: Details Card tests', () => {
  it('should show change password button', () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change Password' })
    ).toBeInTheDocument()
  })

  it('should show delete account button', () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
  })
})

describe('Profile Page: Password Card tests', () => {
  it('should show change password button', () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change Password' })
    ).toBeInTheDocument()
  })

  it('should show New Password textfield', () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('New Password')).toBeInTheDocument()
  })

  it('should show Re-Enter New Password textfield', () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Re-Enter New Password')).toBeInTheDocument()
  })

  it('should show errors when typing false new password', async () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )
    userEvent.type(screen.getByTestId('new-password-field'), '1')
    expect(
      await screen.findByText('Password must be atleast 3 characters or more')
    ).toBeVisible()
    expect(
      await screen.findByText('Required re-enter new password')
    ).toBeVisible()
  })

  it('should show errors when typing only re-enter password', async () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )
    userEvent.type(screen.getByTestId('re-enter-password-field'), '1')
    expect(await screen.findByText('Required new password')).toBeVisible()
  })

  it('should show error when passwords doesnt match', async () => {
    render(
      <BrowserRouter>
        <ProfilePage id={1} />
      </BrowserRouter>
    )
    userEvent.type(screen.getByTestId('new-password-field'), 'abc')
    userEvent.type(screen.getByTestId('re-enter-password-field'), 'abcd')
    expect(await screen.findByText('Passwords arent same')).toBeVisible()
  })
})
