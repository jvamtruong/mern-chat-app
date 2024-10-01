import React from 'react'
import useStore from '../zustand/store'

const Profile = () => {
  console.log('Profile')
  const { authUser } = useStore()

  return (
    <h2 className='font-semibold text-center'>
      {authUser.fullName}
      {`(@${authUser.username})`}
    </h2>
  )
}

export default Profile