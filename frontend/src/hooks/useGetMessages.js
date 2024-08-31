import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useGetMessagesQuery } from '../redux/api/messageApiSlice'
import useStore from '../zustand/store'

const useGetMessages = (selectedConversation) => {
  console.log('useGetMessages')
  const { messages, setMessages } = useStore()

  const { data, isFetching } = useGetMessagesQuery(
    {
      msg_type: selectedConversation?.group ? 'group' : 'one-on-one',
      conversation_id: selectedConversation?._id,
    },
    { refetchOnMountOrArgChange: true }
  )

  console.log('isFetching', isFetching)
  console.log('data', data)

  useEffect(() => {
    console.log('Messages effect')
    try {
      if (!isFetching) setMessages(data)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [isFetching])

  return { isFetching, messages }
}

export default useGetMessages