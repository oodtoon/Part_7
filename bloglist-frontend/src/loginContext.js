import { createContext, useReducer, useContext } from 'react'

const loginReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = ({ children }) => {
  const [login, loginDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginValue = () => {
  const loginAndDispatch = useContext(LoginContext)
  return loginAndDispatch[0]
}

export const useLoginDispatch = () => {
  const loginAndDispatch = useContext(LoginContext)
  return loginAndDispatch[1]
}

export default LoginContext
