import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import useStore from '../../zustand/store'
import { useState } from 'react'
import Participants from './Participants'
import { useQuery } from '@tanstack/react-query'

const SearchUserInput = () => {
  const { selectedConversation } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [participants, setParticipants] = useState<User[]>([])
  
  const { data } = useQuery<DirectConversation[]>({ queryKey: ['directs'] })

  useEffect(() => {
    setSearchTerm('')
    setParticipants([])
  }, [selectedConversation])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const filtered = data?.filter((item: DirectConversation) =>
          item.receiver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item: DirectConversation) => item.receiver)
      if (!filtered?.length) {
        throw new Error('No results found')
      }
      setParticipants(filtered)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <form
        className='form-control w-full max-w-xs flex-auto'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Add member...'
          className='input input-bordered input-sm w-full'
        />
        <button type='submit' className='btn sm:btn-sm md:btn-md lg:btn-lg'>
          search
        </button>
      </form>
      <Participants participants={participants} />
    </div>
  )
}

export default SearchUserInput
