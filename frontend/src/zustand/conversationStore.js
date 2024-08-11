import { create } from 'zustand'

const useConversationStore = create(set => ({
	selectedConversation: null,
  messages: [],

	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages: (messages) => set({ messages }),
}))

export default useConversationStore