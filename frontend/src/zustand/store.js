import { create } from 'zustand'

const useStore = create(set => ({
  authUser: JSON.parse(localStorage.getItem('chat-user')) || null,
	selectedConversation: null,
  messages: [],
  conversations: [],

  setAuthUser: (authUser) => set({ authUser }),
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	setMessages: (messages) => set({ messages }),
  setConversations: (conversations) => set({ conversations }),
}))

export default useStore