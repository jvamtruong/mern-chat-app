import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedConversation: null,
}

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = { ...state.selectedConversation, ...action.payload }
    },
    
  },
})

export const { setSelectedConversation } = conversationSlice.actions
export default conversationSlice.reducer