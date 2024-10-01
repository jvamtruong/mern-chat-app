import { apiSlice } from './apiSlice'
import { CONVERSATION_URL } from '../constants'

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGroups: builder.query({
      query: () => CONVERSATION_URL,
    }),

    createGroup: builder.mutation({
      query: () => ({
        url: `${CONVERSATION_URL}/create`,
        method: 'POST',
      }),
    }),

    addMember: builder.mutation({
      query: ({ selectedConversation_id, participant_id }) => ({
        url: `${CONVERSATION_URL}/add-members/${selectedConversation_id}`,
        method: 'PATCH',
        body: { participant_id },
      }),
    }),
  }),
})

export const {
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useAddMemberMutation,
} = conversationApiSlice