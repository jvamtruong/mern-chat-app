import { apiSlice } from './apiSlice'
import { AUTH_URL, USER_URL } from '../constants'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => USER_URL,
    }),

    signup: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation({
      query: ({ username, password }) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: { username, password },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
    }),
        
  }),
})

export const {
  useGetAllUsersQuery,
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
} = userApiSlice