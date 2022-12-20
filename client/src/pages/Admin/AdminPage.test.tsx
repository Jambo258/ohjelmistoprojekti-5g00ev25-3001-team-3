import AdminPage from './AdminPage'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { AuthContext } from '../../components/shared/auth'
import { BrowserRouter } from 'react-router-dom'

import userEvent from '@testing-library/user-event'

const dummy_Data = [
  {
    id: 1,
    username: 'testguy',
    role: 'normal'
  }
]

describe('Admin Page tests', () => {
  it('Page should contain Id,Username,Role,Functions', async () => {
    render(
      <BrowserRouter>
        <AdminPage data={dummy_Data} changeUsers={jest.fn} />
      </BrowserRouter>
    )

    expect(screen.getByTestId('adminpage-id')).toBeInTheDocument()
    expect(screen.getByTestId('adminpage-username')).toBeInTheDocument()
    expect(screen.getByTestId('adminpage-role')).toBeInTheDocument()
    expect(screen.getByTestId('adminpage-functions')).toBeInTheDocument()
  })

  it('Page should have delete user button, change username button and change password button', async () => {
    render(
      <BrowserRouter>
        <AdminPage data={dummy_Data} changeUsers={jest.fn} />
      </BrowserRouter>
    )

    expect(screen.getByText('Delete User')).toBeInTheDocument()
    expect(screen.getByText('Change Username')).toBeInTheDocument()
    expect(screen.getByText('Change User Password')).toBeInTheDocument()
  })

  it('delete user on adminpage', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const deleteAccountButton = screen.getByRole('button', {
      name: 'Delete User'
    })
    fireEvent.click(deleteAccountButton)
    expect(
      screen.getByText('Are you sure you want to delete user id: 1')
    ).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()
    fireEvent.click(screen.getByText('Yes'))

    expect(screen.getByText('Delete User')).toBeVisible()
  })

  it('delete user on adminpage and press cancel on confirm', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const deleteAccountButton = screen.getByRole('button', {
      name: 'Delete User'
    })
    fireEvent.click(deleteAccountButton)
    expect(
      screen.getByText('Are you sure you want to delete user id: 1')
    ).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()
    fireEvent.click(screen.getByText('No'))

    expect(screen.getByText('Delete User')).toBeVisible()
    expect(await screen.findByText('No')).not.toBeVisible()
    expect(await screen.findByText('Yes')).not.toBeVisible()
  })

  it('change username on adminpage', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const changeUsernameButton = screen.getByTestId('change-username')
    fireEvent.click(changeUsernameButton)
    expect(screen.getByText('Change username for user id: 1')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByTestId('change-username-confirm')).toBeVisible()
    const input = await screen.findByTestId('username-by-admin')

    userEvent.type(input, 'test')

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(await screen.findByTestId('change-username-confirm'))
    })

    expect(await screen.findByText('Functions')).toBeInTheDocument()
    expect(await screen.findByTestId('change-username')).toBeVisible()
  })

  it('change username on adminpage and press cancel on confirm', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const changeUsernameButton = screen.getByTestId('change-username')
    fireEvent.click(changeUsernameButton)
    expect(screen.getByText('Change username for user id: 1')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByTestId('change-username-confirm')).toBeVisible()
    const input = await screen.findByTestId('username-by-admin')

    userEvent.type(input, 'test')

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.click(await screen.findByText('Cancel'))
    })

    expect(await screen.findByText('Functions')).toBeInTheDocument()
    expect(await screen.findByTestId('change-username')).toBeVisible()
  })

  it('change password on adminpage', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const changePasswordButton = screen.getByTestId('change-password')
    fireEvent.click(changePasswordButton)
    expect(screen.getByText('Change password for user id: 1')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByTestId('change-password-confirm')).toBeVisible()
    const input = await screen.findByTestId('password-by-admin')

    userEvent.type(input, 'password')

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(await screen.findByTestId('change-password-confirm'))
    })

    expect(await screen.findByText('Functions')).toBeInTheDocument()
    expect(await screen.findByTestId('change-password')).toBeVisible()
  })

  it('change password on adminpage and press cancel', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '2',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <AdminPage data={dummy_Data} changeUsers={jest.fn} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    const changePasswordButton = screen.getByTestId('change-password')
    fireEvent.click(changePasswordButton)
    expect(screen.getByText('Change password for user id: 1')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByTestId('change-password-confirm')).toBeVisible()
    const input = await screen.findByTestId('password-by-admin')

    userEvent.type(input, 'password')

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(await screen.findByText('Cancel'))
    })

    expect(await screen.findByText('Functions')).toBeInTheDocument()
    expect(await screen.findByTestId('change-password')).toBeVisible()
  })

  it('should show errors when typing false password for user', async () => {
    render(
      <BrowserRouter>
        <AdminPage data={dummy_Data} changeUsers={jest.fn} />
      </BrowserRouter>
    )

    const changeUserpasswordButton = screen.getByRole('button', {
      name: 'Change User Password'
    })
    fireEvent.click(changeUserpasswordButton)
    const input = await screen.findByTestId('password-by-admin')
    expect(screen.getByText('Change password for user id: 1')).toBeVisible()
    userEvent.type(input, 'testpassword')
    userEvent.clear(input)
    expect(await screen.findByText('Required new password')).toBeVisible()
    userEvent.type(screen.getByTestId('password-by-admin'), '1')
    expect(
      await screen.findByText('Password must be atleast 3 characters or more')
    ).toBeVisible()
  })

  it('should show errors when typing false username for user', async () => {
    render(
      <BrowserRouter>
        <AdminPage data={dummy_Data} changeUsers={jest.fn} />
      </BrowserRouter>
    )
    const changeUsernameButton = screen.getByTestId('change-username')

    fireEvent.click(changeUsernameButton)
    const input = await screen.findByTestId('username-by-admin')
    expect(screen.getByText('Change username for user id: 1')).toBeVisible()
    userEvent.type(input, 'test')
    userEvent.clear(input)
    expect(await screen.findByText('Required username')).toBeVisible()
  })
})
