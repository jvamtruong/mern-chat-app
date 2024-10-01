import useGetConversations from '../../hooks/useGetConversations'
import Profile from '../Profile'
import Conversations from './Conversations'
import CreateGroupConversationButton from './CreateGroupConversationButton'
import LogoutButton from './LogoutButton'
import SearchInput from './SearchInput'


const Sidebar = () => {
  console.log('Sidebar')
  const { userLoading, groupLoading } = useGetConversations()

  if (userLoading || groupLoading) {
    // console.log(`userLoading: ${userLoading}, groupLoading: ${groupLoading}`)
    return 'Loading...'
  }
  
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <SearchInput />
      <div className='divider px-3'></div>
      <Conversations isLoading={userLoading && groupLoading} />
      <div className='divider px-3'></div>
      <CreateGroupConversationButton />
      <div className='divider px-3'></div>
      <Profile />
      <LogoutButton />
    </div>
  )
}

export default Sidebar