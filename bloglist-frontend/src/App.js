import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import IndexRoute from './components/routes/IndexRoute'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link,
  //useNavigate,
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

const Notification = ({ message }) => {
  if (message[0] === '') {
    return null
  }
  const type = message[1] ? 'success' : 'error'
  return <div className={type}>{message[0]}</div>
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
    <button id="log-out" onClick={handleLogout}>
      log out
    </button>
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
      <Notification message={message} />
      {user === null && (
        <div>
          <p>log in to application </p>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            login={handleLogin}
          />
        </div>
      )}
      {user !== null && (
        <div>
          {user.name} logged in {logoutForm()}
        </div>
      )}
      <Router>
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
          <Route path="/users/:id" element={<UserBlogs users={users}/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
