import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useGetMessagesQuery } from '../redux/api/messageApiSlice'
import useConversationStore from '../zustand/conversationStore'

const useGetMessages = (selectedConversation) => {
  // console.log('useGetMessages')
  const { setMessages } = useConversationStore()

  const { data, isLoading } = useGetMessagesQuery(
    {
      msg_type: selectedConversation?.group ? 'group' : 'one-on-one',
      conversation_id: selectedConversation?._id,
    },
    { refetchOnMountOrArgChange: true }
  )

  // console.log('loading', isLoading)

  useEffect(() => {
    // console.log('Messages effect')
    try {
      if (data) setMessages(data)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [data])

  return { isLoading }
}

export default useGetMessages