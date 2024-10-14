import MessageInput from './MessageInput'
import Messages from './Messages'
import { TiMessages } from 'react-icons/ti'
import SearchUserInput from './SearchUserInput'
import useStore from '../../zustand/store'
import { useQuery } from '@tanstack/react-query'

const MessageContainer = () => {
  const { selectedConversation } = useStore()

  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className='bg-slate-500 px-4 py-2 mb-2'>
            <span className='label-text'>To:</span>{' '}
            {selectedConversation.kind === 'Conversation' ? (
              selectedConversation.participants.map((participant, idx) => {
                if (idx === selectedConversation.participants.length - 1) {
                  return (
                    <span
                      className='text-gray-900 font-bold'
                      key={participant._id}
                    >
                      {participant.fullName}
                    </span>
                  )
                }
                return (
                  <span
                    className='text-gray-900 font-bold'
                    key={participant._id}
                  >
                    {participant.fullName},{' '}
                  </span>
                )
              })
            ) : (
              <span className='text-gray-900 font-bold'>
                {selectedConversation?.receiver?.fullName}
              </span>
            )}
          </div>
          {/* only group conversations can add new members */}
          {selectedConversation.kind === 'Conversation' && <SearchUserInput />}
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  )
}

export default MessageContainer

const NoChatSelected = () => {
  // console.log('NoChatSelected')
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] })

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
        <p>Welcome 👋 {authUser?.fullName}❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  )
}
