import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import HomePage from '.'
import { AuthContext } from '../../components/shared/auth'

describe('Home Page tests', () => {
  it('should show Search field on page', () => {
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
          <HomePage />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Find products')).toBeInTheDocument()
  })

  it('should show loading spinner', () => {
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
          <HomePage />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    userEvent.type(screen.getByTestId('search-field'), 'battery no calorie')
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
