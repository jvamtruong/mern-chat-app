import { apiSlice } from './apiSlice'
import { USER_URL } from '../constants'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: USER_URL,
      }),
    }),
    
    
  }),
})

export const { useGetAllUsersQuery } = userApiSlice