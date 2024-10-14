import { useQuery } from '@tanstack/react-query'
import Profile from '../Profile'
import Conversations from './Conversations'
import CreateGroupConversationButton from './CreateGroupConversationButton'
import LogoutButton from './LogoutButton'
import SearchInput from './SearchInput'
import axios from 'axios'
import { CONVERSATION_URL, USER_URL } from '../../utils/constants'
import { useEffect } from 'react'
import useStore from '../../zustand/store'

const Sidebar = () => {
  const { conversations, setConversations } = useStore()

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['directs'],
    queryFn: async () => {
      try {
        const res = await axios.get<DirectConversation[]>(USER_URL)
        return res.data
      } catch (error: any) {
        console.error(error.response.data.message || 'something went wrong')
      }
    },
  })

  const { data: groups, isLoading: isGroupLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      try {
        const res = await axios.get<Conversation[]>(CONVERSATION_URL)
        return res.data
      } catch (error: any) {
        console.error(error.response.data.message || 'something went wrong')
      }
    },
  })

  useEffect(() => {
    if (users && groups) {
      users.forEach((user) => {
        user.kind = 'DirectConversation'
      })
      groups.forEach((group) => {
        group.kind = 'Conversation'
      })
      const sorted = [...users, ...groups].sort((a, b) => {
        let u: string
        let v: string

        if (a.kind === 'DirectConversation') {
          u = a.conversation.updatedAt
          v = b.kind === 'DirectConversation' ? b.conversation.updatedAt : b.updatedAt
        } else {
          u = a.updatedAt
          v = b.kind === 'DirectConversation' ? b.conversation.updatedAt : b.updatedAt
        }

        const aDate = new Date(u)
        const bDate = new Date(v)

        return bDate.getTime() - aDate.getTime()
      })
      setConversations(sorted)
    }
  }, [users, groups])

  if (isUsersLoading || isGroupLoading) {
    return 'Loading...'
  }

  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <SearchInput />
      <div className='divider px-3'></div>
      {conversations && (
        <Conversations conversations={conversations} isLoading={false} />
      )}
      <div className='divider px-3'></div>
      <CreateGroupConversationButton />
      <div className='divider px-3'></div>
      <Profile />
      <LogoutButton />
    </div>
  )
}

export default Sidebar
