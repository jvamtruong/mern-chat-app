import React from 'react'
import useStore from '../zustand/store'

const Profile = () => {
  const { authUser } = useStore()

  return (
    <h2 className='font-semibold text-center'>
      {authUser.fullName}
      {`(@${authUser.username})`}
    </h2>
  )
}

export default Profile