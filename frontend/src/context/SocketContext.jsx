import { createContext, useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'
import useStore from '../zustand/store'

const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { authUser } = useStore()

  useEffect(() => {
    if (authUser) {
      const socket = io('http://localhost:3000', {
        query: {
          userId: authUser._id,
        },
      })
      setSocket(socket)
      // socket.on() is used to add listener to the specified event. can be used both on client and server side
      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users)
      })

      return () => socket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [authUser])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}