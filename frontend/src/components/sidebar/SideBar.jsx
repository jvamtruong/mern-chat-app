import useGetConversations from '../../hooks/useGetConversations'
import Conversations from './Conversations'
import CreateGroupConversationButton from './CreateGroupConversationButton'
import LogoutButton from './LogoutButton'
import SearchInput from './SearchInput'

const Sidebar = () => {
  // console.log('Sidebar')
  const { conversations, setConversations, userLoading, groupLoading } = useGetConversations()

  if (userLoading || groupLoading) {
    // console.log(`userLoading: ${userLoading}, groupLoading: ${groupLoading}`)
    return 'Loading...'
  }
  
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <SearchInput />
      <div className='divider px-3'></div>
      <Conversations isLoading={userLoading & groupLoading} conversations={conversations} />
      <div className='divider px-3'></div>
      <CreateGroupConversationButton
        conversations={conversations}
        setConversations={setConversations}
      />
      <LogoutButton />
    </div>
  )
}

export default Sidebar