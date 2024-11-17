import { create } from 'zustand'

interface Store {
  selectedConversation: DirectConversation | Conversation | null
  conversations: (DirectConversation | Conversation)[]

  setSelectedConversation: (selectedConversation: Conversation | DirectConversation | null) => void
  setConversations: (conversations: (DirectConversation | Conversation)[] | undefined) => void
}

const useStore = create<Store>((set) => ({
  selectedConversation: null,
  conversations: [],

  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  setConversations: (conversations) => set({ conversations }),
}))

export default useStore