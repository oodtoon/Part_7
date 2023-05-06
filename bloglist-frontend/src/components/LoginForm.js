import { TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'

const LoginForm = ({
  login,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const loggedUser = { username, password }
    login(loggedUser)
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
            size="small"
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="password"
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
            size="small"
            sx={{ pb: '8px' }}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            id="login-btn"
            type="submit"
          >
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
