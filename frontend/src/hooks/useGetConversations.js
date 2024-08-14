import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useGetAllGroupsQuery } from '../redux/api/conversationApiSlice'
import { useGetAllUsersQuery } from '../redux/api/userApiSlice'

const useGetConversations = () => {
  const [conversations, setConversations] = useState([])

  const {
    data: users,
    error: userError,
    isLoading: userLoading
  } = useGetAllUsersQuery()

  const {
    data: groups,
    error: groupError,
    isLoading: groupLoading
  } = useGetAllGroupsQuery()

  useEffect(() => {
    try {
      console.log('sidebar effect')
      if (userError || groupError) {
        throw new Error(userError?.data?.message || groupError?.data?.message)
      }
      setConversations([
        ...(Array.isArray(users) ? users : []),
        ...(Array.isArray(groups) ? groups : []),
      ])
      // setConversations([...users, ...groups])
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [userLoading, groupLoading])

  return { userLoading, groupLoading, conversations, setConversations }
}

export default useGetConversations