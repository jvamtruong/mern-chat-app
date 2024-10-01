import React from 'react'
import toast from 'react-hot-toast'
import useStore from '../../zustand/store'
import { useAddMemberMutation } from '../../redux/api/conversationApiSlice'

const Participant = ({ participant }) => {
  const { selectedConversation, setSelectedConversation, authUser } = useStore()

  const [addMember] = useAddMemberMutation()

  const handleClick = async () => {
    try {
      // const res = await fetch(
      //   `/api/groups/add-members/${selectedConversation._id}`,
      //   {
      //     method: 'PATCH',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ participant_id: participant._id }),
      //   }
      // )
      // const data = await res.json()
      const data = await addMember({
        selectedConversation_id: selectedConversation._id,
        participant_id: participant._id,
      }).unwrap()
      if (data.error) {
        throw new Error(data.error)
      }
      setSelectedConversation(data)
      toast.success(
        `${authUser.fullName} have added ${
          data.participants[data.participants.length - 1].fullName
        } to the group`
      )
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