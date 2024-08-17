import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import messageReducer from './features/messageSlice'
import conversationReducer from './features/conversationSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    message: messageReducer,
    conversation: conversationReducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true,

})

setupListeners(store.dispatch)
export default store