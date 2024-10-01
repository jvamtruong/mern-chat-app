import { BiLogOut } from 'react-icons/bi'
import useLogout from '../../hooks/useLogout'

const LogoutButton = () => {
  console.log('LogoutButton')
  const { isLoading, logoutUser } = useLogout()

  return (
    <div className='mt-auto flex justify-end w-full'>
      {!isLoading ? (
        <BiLogOut
          className='w-6 h-6 text-white cursor-pointer mr-4'
          onClick={logoutUser}
        />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  )
}

export default LogoutButton