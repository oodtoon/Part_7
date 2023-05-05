import { createContext, useReducer, useContext } from 'react'

const NotificationReducer = (state, action) => {
  switch (action.type) {
  case 'CREATE':
  case 'LIKE':
  case 'LOGGED':
  case 'FAILED-LOG':
    return [action.data[0], action.data[1]]
  case 'NONE':
    return ['', true]
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(NotificationReducer, [
    '',
    true,
  ])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  console.log(notificationAndDispatch)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext
