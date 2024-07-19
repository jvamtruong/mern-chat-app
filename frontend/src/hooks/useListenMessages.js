import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"
import notificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = (selectedConversation) => {
	const { socket } = useSocketContext()
	const { messages, setMessages } = useConversation()

	useEffect(() => {
    console.log('Messages socket effect')
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true
			const sound = new Audio(notificationSound)
			sound.play()
      if (newMessage.senderId.toString() === selectedConversation._id.toString()) {
				setMessages([...messages, newMessage])
			}
		})

		return () => socket?.off("newMessage")
	}, [socket, messages])
}

export default useListenMessages