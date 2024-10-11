import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AUTH_URL } from './utils/constants'

const App = () => {
  // console.log('App')
  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axios.get<User>(`${AUTH_URL}/me`)
        return res.data
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return null
        }
        toast.error(error.response.data.message || 'Something went wrong')
        return null
      }
    },
  })

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route
          path='/'
          element={authUser ? <Home /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={authUser ? <Navigate to='/' /> : <Login />}
        />
        <Route
          path='/signup'
          element={authUser ? <Navigate to='/' /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App