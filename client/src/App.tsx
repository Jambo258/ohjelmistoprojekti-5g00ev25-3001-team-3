import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  createTheme,
  ThemeProvider
  // useTheme
} from '@mui/material'

import './App.css'
import ButtonappBar from './components/nav/ButtonappBar'
import HomePage from './pages/Home'
import { AuthContext } from './components/shared/auth'
import UserFavoriteProductsPage from './pages/UserFavoriteProducts/UserFavoriteProductsPage'
import DarkModeSwitcher from './components/shared/DarkModeSwitcher'
import AdminPage from './pages/Admin/AdminPage'
import LoginPage from './pages/Login/LoginPage'
import ProfilePage from './pages/Profile/ProfilePage'
import SignupPage from './pages/Signup/SignupPage'
import SingularProductPage from './pages/SingularProduct'

const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')

  useEffect(() => {
    // If there is a window
    if (typeof window !== 'undefined') {
      const localMode = window.localStorage.getItem('theme')
      if (localMode === 'light') setMode('light')
      if (localMode === 'dark') setMode('dark')
      else setMode('light')
    }
  }, [])

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        // setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light'
          window.localStorage.setItem('theme', newMode)
          return newMode
        })
      }
    }),
    []
  )

  // Custom palette
  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
          ].join(',')
        },
        palette: {
          mode,
          primary: {
            main: '#4d4c7d'
          },
          secondary: {
            main: '#d8b9c3'
          }
        }
      }),
    [mode]
  )

  const [token, setToken] = useState<boolean | null | any>(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>()
  const [userId, setUserId] = useState<boolean | any>(false)
  const [role, setRole] = useState<string | any>('')
  //const auth = useContext(AuthContext)
  const [users, setUsers] = useState<any[]>([])

  const login = useCallback(
    (
      uid: boolean | any | ((prevState: boolean) => boolean),
      token: boolean | any | ((prevState: boolean) => boolean),
      role: React.SetStateAction<string> | any,
      expirationDate: Date | any
    ) => {
      //prevent a render loop
      setToken(token)
      setUserId(uid)
      setRole(role)
      //current date in ms + 1h
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
      setTokenExpirationDate(tokenExpirationDate)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          role: role,
          expiration: tokenExpirationDate.toISOString()
        })
      )
    },
    []
  )

  const logout = useCallback(() => {
    //prevent a render loop
    setToken(null)
    setUserId(null)
    setRole(null)
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    let logoutTimer
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(`${localStorage.getItem('userData')}`)
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // if greater, still in future
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.role,
        new Date(storedData.expiration)
      )
    }
  }, [login])

  useEffect(() => {
    const fetchUsers = async () => {
      if (role === 'admin') {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_LOCAL_BACKEND_URL}/users`
          )
          const data = await response.json()

          setUsers(data)
        } catch (err) {}
      }
    }
    fetchUsers()
  }, [role])

  let routes
  if (role === 'normal') {
    routes = (
      <BrowserRouter>
        <ButtonappBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage id={userId} />} />
          <Route path="userfavorites" element={<UserFavoriteProductsPage />} />
          <Route
            path="singularproductpage/:pid"
            element={<SingularProductPage />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    )
  } else if (role === 'admin') {
    routes = (
      <BrowserRouter>
        <ButtonappBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage id={userId} />} />
          <Route
            path="adminpage"
            element={<AdminPage data={users} changeUsers={setUsers} />}
          />
          <Route path="userfavorites" element={<UserFavoriteProductsPage />} />
          <Route
            path="singularproductpage/:pid"
            element={<SingularProductPage />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    )
  } else {
    routes = (
      <BrowserRouter>
        <ButtonappBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="singularproductpage/:pid"
            element={<SingularProductPage />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        role: role,
        login: login,
        logout: logout
      }}
    >
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <main>
            {routes}
            <DarkModeSwitcher theme={theme} colorMode={colorMode} />
          </main>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
