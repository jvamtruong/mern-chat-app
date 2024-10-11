import { extractTime } from '../../utils/extractTime'
import useStore from '../../zustand/store'
import { useQuery } from '@tanstack/react-query'

interface Props {
  message: Message
}

const Message = ({ message }: Props) => {
  console.log('Message')
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] })
  const { selectedConversation } = useStore()
  console.log(message.sender._id, authUser?._id)
  const fromMe = message.sender._id === authUser?._id
  const formattedTime = extractTime(message.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.kind === 'DirectConversation'
    ? selectedConversation.receiver.profilePic
    : undefined
  const bubbleBgColor = fromMe ? 'bg-blue-500' : ''
  const shakeClass = message.shouldShake ? 'shake' : ''

  return (
    <div className={`chat ${chatClassName}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt='Tailwind CSS chat bubble component' src={profilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message?.message}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {formattedTime}
      </div>
    </div>
  )
}

export default Message