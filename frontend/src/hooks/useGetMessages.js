import { useEffect, useState } from 'react'
import useConversation from '../zustand/conversationStore'
import toast from 'react-hot-toast'

const useGetMessages = (selectedConversation) => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages } = useConversation()

  useEffect(() => {
    console.log('Messages effect')
    const getMessages = async () => {
      setLoading(true)
      try {
        const msgType = selectedConversation.group ? 'group' : 'one-on-one'
        const res = await fetch(
          `/api/messages/${msgType}/${selectedConversation._id}`
        )
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setMessages(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?._id) getMessages()
  }, [selectedConversation?._id])

  return { messages, loading }
}

export default useGetMessages