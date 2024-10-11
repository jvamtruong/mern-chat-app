import { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import useStore from '../../zustand/store'
import { MESSAGE_URL } from '../../utils/constants'

const MessageInput = () => {
  // console.log('message input')
  const [message, setMessage] = useState('')
  const { selectedConversation } = useStore()
  const queryClient = useQueryClient()

  const msg_type =
    selectedConversation?.kind === 'DirectConversation' ? 'direct' : 'group'
  const id =
    selectedConversation?.kind === 'DirectConversation'
      ? selectedConversation.receiver._id
      : selectedConversation?._id

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (message: string) =>
      axios.post(`${MESSAGE_URL}/send/${id}`, { message, msg_type }),
    onSuccess: () => {
      setMessage('')
      queryClient.invalidateQueries({ queryKey: ['messages', msg_type, id] })
    },
    onError: (error: any) => {
      console.error(error)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message) return
    sendMessage(message)
  }

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='submit'
          className='absolute inset-y-0 end-0 flex items-center pe-3'
        >
          {isPending ? (
            <div className='loading loading-spinner'></div>
          ) : (
            <BsSend />
          )}
        </button>
      </div>
    </form>
  )
}

export default MessageInput
