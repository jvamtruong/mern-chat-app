import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CONVERSATION_URL } from '../../utils/constants'
import axios from 'axios'

const CreateGroupConversationButton = () => {
  const queryClient = useQueryClient()

  const { mutate: createGroup } = useMutation({
    mutationFn: () => axios.post(`${CONVERSATION_URL}/create`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('a new group conversation was created')
    },
    onError: (error: any) => {
      console.error(error.response.data.message)
      toast.error(error.response.data.message || 'Something went wrong')
    },
  })

  return (
    <button
      className='btn btn-xs sm:btn-sm md:btn-md lg:btn-lg rounded'
      onClick={() => createGroup()}
    >
      create a group
    </button>
  )
}

export default CreateGroupConversationButton
