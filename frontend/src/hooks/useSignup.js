import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'
import { useSignupMutation } from '../redux/api/userApiSlice'

const useSignup = () => {
  const { setAuthUser } = useAuthContext()
  const [signup, { isLoading }] = useSignupMutation()

  const signUpUser = async ({ fullName, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    })
    if (!success) return
    try {
      const data = await signup({
        fullName,
        username,
        password,
        gender,
      }).unwrap()
      if (data?.error) throw new Error(data?.error)
      localStorage.setItem('chat-user', JSON.stringify(data))
      setAuthUser(data)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return { isLoading, signUpUser }
}

export default useSignup

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error('Please fill in all fields')
    return false
  }

  if (password !== confirmPassword) {
    toast.error('Passwords do not match')
    return false
  }

  if (password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return false
  }

  return true
}