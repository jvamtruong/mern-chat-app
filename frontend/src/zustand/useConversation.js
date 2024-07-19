import { create } from "zustand"

const useConversation = create(set => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
  count: 0,
  setCount: (count) => set({ count }),
  random: '',
  setRandom: (random) => set({ random }),
}))

export default useConversation