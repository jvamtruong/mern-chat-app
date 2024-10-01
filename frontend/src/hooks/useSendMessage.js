import useStore from '../zustand/store'
import toast from 'react-hot-toast'
import { useSendMessageMutation } from '../redux/api/messageApiSlice'

const useSendMessage = () => {
  const { messages, setMessages, selectedConversation } = useStore()
  const [send, { isLoading }] = useSendMessageMutation()

  const sendMessage = async (message) => {
    try {
      const data = await send({
        message,
        msg_type: selectedConversation?.group ? 'group' : 'one-on-one',
        conversation_id:
          selectedConversation?._id || selectedConversation?.user?._id,
      }).unwrap()

      if (data?.error) throw new Error(data?.error)
      if (data) setMessages([...messages, data])
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return { sendMessage, isLoading }
}

export default useSendMessage