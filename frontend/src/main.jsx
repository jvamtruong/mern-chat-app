import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { apiSlice } from './redux/api/apiSlice.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ApiProvider api={apiSlice}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </ApiProvider>
  </BrowserRouter>
)