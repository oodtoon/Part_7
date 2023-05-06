import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NotificationContextProvider } from './NotificationContext'
import { LoginContextProvider } from './loginContext'

import { Container } from '@mui/material'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container>
    <LoginContextProvider>
      <NotificationContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </NotificationContextProvider>
    </LoginContextProvider>
  </Container>
)
