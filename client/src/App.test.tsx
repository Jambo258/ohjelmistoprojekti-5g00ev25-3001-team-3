import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import { AuthContext } from './components/shared/auth'
import ButtonappBar from './components/nav/ButtonappBar'

describe('App render tests', () => {
  // it('should show Home Page without logging in', () => {
  //   render(<App />)

  //   expect(screen.getByText('Home Page')).toBeInTheDocument()
  //   expect(screen.getByText('Home Page')).toHaveAttribute('href', '/')
  // })

  it('should show Login without logging in', () => {
    render(<App />)

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  // it('should show Signup without logging in', () => {
  //   render(<App />)

  //   expect(screen.getByTestId('Signup')).toBeInTheDocument()
  // })

  it('should show different nav links when logged in', () => {
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
          <ButtonappBar />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByTestId('profile-page')).toBeInTheDocument()
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })

  it('should show different nav links when logged in as admin', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: '1',
          role: 'admin',
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <ButtonappBar />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByTestId('admin-page')).toBeInTheDocument()
    expect(screen.getByTestId('profile-page')).toBeInTheDocument()

    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })
})
