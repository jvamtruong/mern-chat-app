import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useGetMessagesQuery } from '../redux/api/messageApiSlice'
import useConversationStore from '../zustand/conversationStore'

const useGetMessages = (selectedConversation) => {
  console.log('useGetMessages')
  const { messages, setMessages } = useConversationStore()

  const { data, error, isLoading } = useGetMessagesQuery({
    msg_type: selectedConversation?.group ? 'group' : 'one-on-one',
    conversation_id: selectedConversation?._id,
  })

  console.log('loading', isLoading)

  useEffect(() => {
    console.log('Messages effect')
    try {
      if (error) throw new Error(error.message)
      if (data) setMessages(data)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [data, isLoading])

  return { messages, isLoading }
}

export default useGetMessages