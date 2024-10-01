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
      if (users?.error || groups?.error) {
        throw new Error(users?.error || groups?.error)
      }
      if (users && groups) {
        const sorted = [...users, ...groups].sort((a, b) => {
          return (
            new Date(b?.conversation?.updatedAt || b?.updatedAt) -
            new Date(a?.conversation?.updatedAt || a?.updatedAt)
          )
        })
        setConversations(sorted)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }, [users, groups])

  return { userLoading, groupLoading, conversations, setConversations }
}

export default useGetConversations
