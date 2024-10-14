import { useQuery } from '@tanstack/react-query'

const Profile = () => {
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] })

  return (
    <h2 className='font-semibold text-center'>
      {authUser?.fullName}
      {`(@${authUser?.username})`}
    </h2>
  )
}

export default Profile
