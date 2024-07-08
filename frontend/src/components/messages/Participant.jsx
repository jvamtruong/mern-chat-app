import React from 'react'
import toast from 'react-hot-toast'
import useConversation from '../../zustand/useConversation'
import { useAuthContext } from '../../context/AuthContext'


const Participant = ({ participant }) => {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { authUser } = useAuthContext()

  const handleClick = async () => {
    try {
      const res = await fetch(`/api/groups/add-members/${selectedConversation._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participant_id: participant._id })
      })
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setSelectedConversation(data)
      toast.success(`${authUser.fullName} have added ${data.participants[data.participants.length - 1].fullName} to the group`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center' onClick={handleClick}>
        <span className='text-gray-900 font-bold'>{participant.fullName}</span>
        <span className='text-gray-900 font-bold'>(@{participant.username})</span>
    </div>
  )
}

export default Participant