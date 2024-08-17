import { create } from 'zustand'

const useConversationStore = create(set => ({
	selectedConversation: {},
  messages: [],

	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages: (messages) => set({ messages }),
}))

export default useConversationStore