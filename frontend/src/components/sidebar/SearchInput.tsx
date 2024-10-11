import { useState } from 'react'
import { FaSearchDollar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useStore from '../../zustand/store'

const SearchInput = () => {
  console.log('SearchInput') 
  const [search, setSearch] = useState<string>('')
  const { conversations, setSelectedConversation } = useStore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!search) return
    if (search.length < 3) {
      return toast.error('Search term must be at least 3 characters long')
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    )

    if (conversation) {
      setSelectedConversation(conversation)
      setSearch('')
    } else toast.error('No such user found!')
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-2'>
      <input
        type='text'
        placeholder='Search…'
        className='input input-bordered rounded-full'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
        <FaSearchDollar className='w-6 h-6 outline-none' />
      </button>
    </form>
  )
}

export default SearchInput
