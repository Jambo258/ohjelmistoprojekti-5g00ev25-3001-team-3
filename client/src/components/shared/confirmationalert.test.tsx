import { fireEvent, render, screen } from '@testing-library/react'
import ConfirmationAlert from './confirmationalert'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from './auth'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))
beforeEach(() => {
  mockedUsedNavigate.mockReset()
})

describe('confirmation alert tests', () => {
  it('should show confirmation alert when trying to delete account', () => {
    render(
      <BrowserRouter>
        <ConfirmationAlert id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
    const deleteAccountButton = screen.getByRole('button', {
      name: 'Delete Account'
    })
    fireEvent.click(deleteAccountButton)
    expect(
      screen.getByText('Are you sure you want to delete account?')
    ).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()
  })

  it('should go back to ConfirmationAlert page when cancelling delete account by pressing no', () => {
    render(
      <BrowserRouter>
        <ConfirmationAlert id={1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
    const deleteAccountButton = screen.getByRole('button', {
      name: 'Delete Account'
    })
    fireEvent.click(deleteAccountButton)
    expect(
      screen.getByText('Are you sure you want to delete account?')
    ).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()

    const cancelDeleteAccount = screen.getByRole('button', {
      name: 'No'
    })
    fireEvent.click(cancelDeleteAccount)
    expect(screen.getByText('Delete Account')).toBeVisible()
  })

  it('should show go to ConfirmationAlert page after deleting account', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '1',
          role: 'normal',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <ConfirmationAlert id={1} />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
    const deleteAccountButton = screen.getByRole('button', {
      name: 'Delete Account'
    })
    fireEvent.click(deleteAccountButton)
    expect(
      screen.getByText('Are you sure you want to delete account?')
    ).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()
    const confirmYes = await screen.findByTestId('confirm')

    fireEvent.click(confirmYes)

    expect(await screen.findByText('No')).not.toBeVisible()
    expect(await screen.findByText('Yes')).not.toBeVisible()
  })
})
