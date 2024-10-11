import toast from 'react-hot-toast'
import useStore from '../../zustand/store'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CONVERSATION_URL } from '../../utils/constants'
import { SquarePlus, Trash2 } from 'lucide-react'

interface Props {
  participant: User
}

const Participant = ({ participant }: Props) => {
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] })
  const { selectedConversation, setSelectedConversation } = useStore()

  const { mutate: addMember } = useMutation({
    mutationFn: (data: any) =>
      axios.patch(`${CONVERSATION_URL}/add-members/${data.conversation_id}`, {
        participant_id: data.participant_id,
      }),
    onSuccess: ({ data }) => {
      data.kind = 'Conversation'
      setSelectedConversation(data)
      toast.success(
        `${authUser?.fullName} has added ${
          data.participants[data.participants.length - 1].fullName
        } to the group`
      )
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })

  const { mutate: deleteMember } = useMutation({
    mutationFn: (data: any) =>
      axios.patch(
        `${CONVERSATION_URL}/delete/${data.group_id}/${data.member_id}`
      ),
    onSuccess: ({ data }) => {
      data.kind = 'Conversation'
      setSelectedConversation(data)
      toast.success(`${participant.fullName} has been removed from the group`)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })

  const handleAddMember = () => {
    addMember({
      conversation_id: (selectedConversation as Conversation)._id,
      participant_id: participant._id,
    })
  }
  const handleDeleteMember = () => {
    deleteMember({
      group_id: (selectedConversation as Conversation)._id,
      member_id: participant._id,
    })
  }

  return (
    <div className='flex items-center hover:bg-orange-100'>
      <span className='text-gray-900 font-bold'>{participant.fullName}</span>
      <span className='text-gray-900 font-bold'>(@{participant.username})</span>
      <SquarePlus
        onClick={handleAddMember}
        className='ml-auto mr-2'
        size={18}
        color='green'
      />
      <Trash2 onClick={handleDeleteMember} size={18} color='red' />
    </div>
  )
}

export default Participant
