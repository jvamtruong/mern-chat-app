import { apiSlice } from './apiSlice'
import { CONVERSATION_URL } from '../constants'

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGroups: builder.query({
      query: () => ({
        url: CONVERSATION_URL,
      }),
    }),
    
  })
})

export const { useGetAllGroupsQuery } = conversationApiSlice