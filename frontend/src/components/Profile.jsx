import React from 'react'
import { useAuthContext } from '../context/AuthContext'

const Profile = () => {
  const { authUser } = useAuthContext()

  return (
    <h2 className='font-semibold text-center'>
      {authUser.fullName}
      {`(@${authUser.username})`}
    </h2>
  )
}

export default Profile