import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useGetAllGroupsQuery } from '../redux/api/conversationApiSlice'
import { useGetAllUsersQuery } from '../redux/api/userApiSlice'
import useStore from '../zustand/store'

const useGetConversations = () => {
  console.log('useGetConversations')
  const { setConversations } = useStore()

  const { data: users, isFetching: userLoading } = useGetAllUsersQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  const { data: groups, isFetching: groupLoading } = useGetAllGroupsQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  console.log('userLoading', userLoading)
  console.log('groupLoading', groupLoading)

  useEffect(() => {
    try {
      console.log('sidebar effect')
      if (users?.error || groups?.error) {
        throw new Error(users?.error || groups?.error)
      }
      if (!userLoading && !groupLoading) {
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
  }, [userLoading, groupLoading])

  return { userLoading, groupLoading }
}

export default useGetConversations