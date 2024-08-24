import { create } from 'zustand'

const useStore = create(set => ({
  authUser: JSON.parse(localStorage.getItem('chat-user')) || null,
	selectedConversation: null,
  messages: [],

  setAuthUser: (authUser) => set({ authUser }),
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages: (messages) => set({ messages }),
}))

export default useStore