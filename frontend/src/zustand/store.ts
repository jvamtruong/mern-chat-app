import { create } from 'zustand'

interface Store {
  // authUser: User | null
  // messages: Message[]
  // setAuthUser: (authUser: User | null | undefined) => void
  // setMessages: (messages: Message[]) => void
  selectedConversation: DirectConversation | Conversation | null
  conversations: (DirectConversation | Conversation)[]

  setSelectedConversation: (selectedConversation: Conversation | DirectConversation | null) => void
  setConversations: (conversations: (DirectConversation | Conversation)[] | undefined) => void
}

const useStore = create<Store>((set) => ({
  // authUser: null,
  // messages: [],
  selectedConversation: null,
  conversations: [],

  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  setConversations: (conversations) => set({ conversations }),
  // setMessages: (messages) => set({ messages }),
  // setAuthUser: (authUser) => set({ authUser }),
}))

export default useStore