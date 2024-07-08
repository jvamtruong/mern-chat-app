import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import useConversation from '../../zustand/useConversation'
import { useState } from 'react'
import Participants from './Participants'

const SearchUserInput = () => {
  const { selectedConversation } = useConversation()
  const [search, setSearch] = useState('')
  const [ participants, setParticipants] = useState([])

  useEffect(() => {
    setSearch('')
    setParticipants([])
  }, [selectedConversation])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      const filtered = data.filter(user => user.fullName.toLowerCase().includes(search.toLowerCase()))
      if (!filtered.length) {
        throw new Error('No results found')
      }
      setParticipants(filtered)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
       <form className="form-control w-full max-w-xs flex-auto" onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Add member..." 
            className="input input-bordered input-sm w-full"
          />
          <button type="submit" className="btn sm:btn-sm md:btn-md lg:btn-lg">search</button>
      </form>
      {/* {results.map(user => (
        <div key={user._id} onClick={handleClick}>
          <p>@{user.username} --- {user.fullName}</p>
        </div>
      ))} */}
      <Participants participants={participants} />
    </div>
  )
}

export default SearchUserInput
