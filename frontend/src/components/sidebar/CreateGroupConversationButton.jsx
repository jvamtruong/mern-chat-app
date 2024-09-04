import React from 'react'
import toast from 'react-hot-toast'
import useStore from '../../zustand/store'
import { useCreateGroupMutation } from '../../redux/api/conversationApiSlice'

const CreateGroupConversationButton = () => {
  console.log('CreateGroupConversationButton')
  const { conversations, setConversations } = useStore()
  const [createGroup] = useCreateGroupMutation()
  
  const handleOnClick = async () => {
    try {
      // const res = await fetch('/api/groups/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // })
      // const data = await res.json()
      // if (data.error) {
      //   throw new Error(data.error)
      // }
      const data = await createGroup().unwrap()
      if (data.error) {
        throw new Error(data.error)
      }
      setConversations([...conversations, data])
      toast.success('a new group conversation was created')
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <button
      className='btn btn-xs sm:btn-sm md:btn-md lg:btn-lg'
      onClick={handleOnClick}
    >
      create a group
    </button>
  )
}

export default CreateGroupConversationButton