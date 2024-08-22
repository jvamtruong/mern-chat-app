import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useLogoutMutation } from '../redux/api/userApiSlice'
import useConversationStore from '../zustand/conversationStore'

const useLogout = () => {
  const { setAuthUser } = useAuthContext()
  const { setSelectedConversation } = useConversationStore()
  const [logout, { isLoading }] = useLogoutMutation()

  const logoutUser = async () => {
    try {
      const res = await logout().unwrap()
      if (res.error) {
        throw new Error(res.error)
      }
      console.log(res.message)
      localStorage.removeItem('chat-user')
      setAuthUser(null)
      setSelectedConversation(null)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return { isLoading, logoutUser }
}

export default useLogout