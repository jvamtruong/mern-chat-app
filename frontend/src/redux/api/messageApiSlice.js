import { CONVERSATION_URL, MESSAGE_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnseenMessages: builder.query({
      query: (conversation_id) =>
        `${CONVERSATION_URL}/unseen/${conversation_id}`,
    }),

    getMessages: builder.query({
      query: ({ msg_type, conversation_id }) =>
        `${MESSAGE_URL}/${msg_type}/${conversation_id}`,
    }),
  }),
})

export const { useGetUnseenMessagesQuery, useGetMessagesQuery } =
  messageApiSlice
