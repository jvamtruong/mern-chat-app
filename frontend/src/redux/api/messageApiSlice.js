import { CONVERSATION_URL, MESSAGE_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnseenMessages: builder.query({
      query: (id) =>
        `${CONVERSATION_URL}/unseen/${id}`,
    }),

    getMessages: builder.query({
      query: ({ msg_type, conversation_id }) =>
        `${MESSAGE_URL}/${msg_type}/${conversation_id}`,
    }),

    sendMessage: builder.mutation({
      query: ({ msg_type, conversation_id, message }) => ({
        url: `${MESSAGE_URL}/send/${conversation_id}`,
        method: 'POST',
        body: { message, msg_type },
      }),
    }),
  }),
})

export const {
  useGetUnseenMessagesQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = messageApiSlice