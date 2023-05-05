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
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button id="login-btn" type="submit">
        login
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
