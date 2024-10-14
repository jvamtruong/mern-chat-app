import { BiLogOut } from 'react-icons/bi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { AUTH_URL } from '../../utils/constants'
import useStore from '../../zustand/store'
import toast from 'react-hot-toast'

const LogoutButton = () => {
  const queryClient = useQueryClient()
  const { setSelectedConversation } = useStore()
  const { mutate: logout, isPending} = useMutation({
    mutationFn: () => axios.post(`${AUTH_URL}/logout`),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['authUser'] })
      queryClient.setQueryData(['authUser'], null)
      setSelectedConversation(null)
    },
    onError: (error: any) => {
      console.error(error.response.data.message)
      toast.error(error.response.data.message || 'Something went wrong')
    },
  })

  return (
    <div className='mt-auto flex justify-end w-full'>
      {!isPending ? (
        <BiLogOut
          className='w-6 h-6 text-white cursor-pointer mr-4'
          onClick={() => logout()}
        />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  )
}

export default LogoutButton