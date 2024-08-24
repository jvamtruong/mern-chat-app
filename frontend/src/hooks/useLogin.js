import toast from 'react-hot-toast'
import { useLoginMutation } from '../redux/api/userApiSlice'
import useStore from '../zustand/store'

const useLogin = () => {
  const { setAuthUser } = useStore()
  const [login, { isLoading }] = useLoginMutation()

  const loginUser = async ({ username, password }) => {
    const success = handleInputErrors(username, password)
    if (!success) return
    try {
      const data = await login({ username, password }).unwrap()
      // console.log(data)
      if (data?.error) {
        throw new Error(data?.error)
      }
      if (data) {
        localStorage.setItem('chat-user', JSON.stringify(data))
        setAuthUser(data)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return { isLoading, loginUser }
}

export default useLogin

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error('Please fill in all fields')
    return false
  }

  return true
}