import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import IndexRoute from './components/routes/IndexRoute'
import BlogDetails from './components/routes/BlogRoute'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'

import './app.css'

import {
  useNotificationValue,
  useNotificationDispatch,
} from './NotificationContext'

import { useLoginDispatch, useLoginValue } from './loginContext'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import UserRoute from './components/routes/UsersRoute'
import UserBlogs from './components/UserBlogs'

import {
  Alert,
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
      darker: '#f5deb3 ',
      contrastText: '#2196F3',
    },
  },
})

const Notification = ({ message }) => {
  if (message[0] === '') {
    return null
  }
  const type = message[1] ? 'success' : 'error'
  return (
    <div>
      <Alert severity="success" className={type}>
        {message[0]}
      </Alert>
    </div>
  )
}

const App = () => {
  const queryClient = useQueryClient()

  const blogVoteMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
    },
  })

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
    },
  })

  const newCommentMutation = useMutation(blogService.comment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const user = useLoginValue()
  const setUser = useLoginDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const message = useNotificationValue()
  const setMessage = useNotificationDispatch()

  const {
    isLoading,
    isError,
    data: blogs,
  } = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false,
  })

  const { data: users } = useQuery('users', userService.getAll, {
    refetchOnWindowFocus: false,
  })

  const blogFormRef = useRef()

  const handleLogin = async () => {
    try {
      const loggedUser = await loginService.login({
        username,
        password,
      })
      setUser({ type: 'LOGIN', data: loggedUser })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )
      setUsername('')
      setPassword('')
      blogService.setToken(loggedUser.token)
      setMessage({
        type: 'LOGGED',
        data: [`${loggedUser.name} successfully logged in`, true],
      })
      setTimeout(() => {
        setMessage({
          type: 'NONE',
        })
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage({
        type: 'FAILED-LOG',
        data: ['Wrong username or password', false],
      })
      setTimeout(() => {
        setMessage({
          type: 'NONE',
        })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser({ type: 'LOGOUT' })
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blog) => {
    try {
      newBlogMutation.mutate(blog)
      blogFormRef.current.toggleVisibility()
      setMessage({
        type: 'CREATE',
        data: [`A new blog ${blog.title} by ${blog.author} added`, true],
      })
      setTimeout(() => {
        setMessage({
          type: 'NONE',
        })
      }, 5000)
    } catch (error) {
      console.log(error)
    }
  }

  const addComment = async (blog) => {
    try {
      newCommentMutation.mutate(blog)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      deleteBlogMutation.mutate(id)
    } catch (error) {
      console.log(error)
    }
  }

  const addLikeTo = async (blog) => {
    try {
      blogVoteMutation.mutate(blog)
      setMessage({
        type: 'LIKE',
        data: [`blog ${blog.title} liked`, true],
      })
      setTimeout(() => {
        setMessage({ type: 'NONE' })
      }, 5000)
    } catch (error) {
      console.log(error)
    }
  }

  const logoutForm = () => (
    <ThemeProvider theme={theme}>
      <Button
        color="primary"
        variant="contained"
        id="log-out"
        onClick={handleLogout}
      >
        log out
      </Button>
    </ThemeProvider>
  )

  useEffect(() => {
    const loggedUserJSON = JSON.parse(
      window.localStorage.getItem('loggedBlogappUser')
    )
    if (loggedUserJSON) {
      blogService.setToken(loggedUserJSON.token)
    }
  }, [user])

  if (isLoading) {
    return <div>Blogs loading...</div>
  }

  if (isError) {
    return <div>blog service note available due to problems in server</div>
  }

  blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Button color="inherit">
              <NavLink className="nav-link" to="/">
                blogs
              </NavLink>
            </Button>
            <Button>
              <NavLink className="nav-link" to="/users">
                users
              </NavLink>
            </Button>
            {user === null && <>log in to application</>}
            {user !== null && (
              <>
                {user.name} logged in <a style={{ marginLeft: '1em' }}></a>
                {logoutForm()}
              </>
            )}
          </Toolbar>
        </AppBar>
        <Notification message={message} />

        <Container>
          {user === null && (
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              login={handleLogin}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <IndexRoute
                  blogs={blogs}
                  user={user}
                  addLikeTo={addLikeTo}
                  addBlog={addBlog}
                  deleteBlog={deleteBlog}
                  blogFormRef={blogFormRef}
                />
              }
            />
            <Route path="/users" element={<UserRoute users={users} />} />
            <Route path="/users/:id" element={<UserBlogs users={users} />} />
            <Route
              path="/blogs/:id"
              element={
                <BlogDetails
                  blogs={blogs}
                  user={user}
                  addLike={addLikeTo}
                  removeBlog={deleteBlog}
                  addComment={addComment}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  )
}

export default App
