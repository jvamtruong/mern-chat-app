import useGetConversations from "../../hooks/useGetConversations"
import { getRandomEmoji } from "../../utils/emojis"
import Conversation from "./Conversation"

const Conversations = ({ isLoading, conversations }) => {
  // console.log('Conversations')
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation?._id || conversation?.user?._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{isLoading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	)
}

export default Conversations