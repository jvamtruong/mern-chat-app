import MessageInput from './MessageInput'
import Messages from './Messages'
import { TiMessages } from 'react-icons/ti'
import { useAuthContext } from '../../context/AuthContext'
import SearchUserInput from './SearchUserInput'
import useStore from '../../zustand/store'

const MessageContainer = () => {
  // console.log('MessageContainer')
  const { selectedConversation } = useStore()
  // console.log(selectedConversation?.fullName, selectedConversation?._id)

  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className='bg-slate-500 px-4 py-2 mb-2'>
            <span className='label-text'>To:</span>{' '}
            {selectedConversation?.group ? (
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
                {selectedConversation.fullName}
              </span>
            )}
          </div>
          {/* only group conversations can add new members */}
          {selectedConversation.group && <SearchUserInput />}
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
  const { authUser } = useAuthContext()

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  )
}
