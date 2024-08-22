import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useGetAllGroupsQuery } from '../redux/api/conversationApiSlice'
import { useGetAllUsersQuery } from '../redux/api/userApiSlice'

const useGetConversations = () => {
  const [conversations, setConversations] = useState([])

  const { data: users, isLoading: userLoading } = useGetAllUsersQuery(null, {
    refetchOnMountOrArgChange: true,
  })
  
  const { data: groups, isLoading: groupLoading } = useGetAllGroupsQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    try {
      // console.log('sidebar effect')
      // if (userError || groupError) {
      //   throw new Error(userError?.data?.message || groupError?.data?.message)
      // }
      if (users?.error || groups?.error) {
        throw new Error(users?.error || groups?.error)
      }
      if (users && groups) {
        setConversations([...users, ...groups])
      }
      // setConversations([
      //   ...(Array.isArray(users) ? users : []),
      //   ...(Array.isArray(groups) ? groups : []),
      // ])
      // setConversations([...users, ...groups])
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [users, groups])

  return { userLoading, groupLoading, conversations, setConversations }
}

export default useGetConversations