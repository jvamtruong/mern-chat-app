import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { apiSlice } from './redux/api/apiSlice.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ApiProvider api={apiSlice}>
      <BrowserRouter>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </ApiProvider>
  </>
)