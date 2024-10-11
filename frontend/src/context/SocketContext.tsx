import { createContext, useState, useEffect, useContext } from 'react'
import io, { Socket } from 'socket.io-client'
import useStore from '../zustand/store'
import { useQuery } from '@tanstack/react-query'

interface ISocketContext {
  socket: Socket | null
  onlineUsers: string[]
}

const SocketContext = createContext<ISocketContext | null>(null)

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  // const { authUser } = useStore()
  const { data: authUser } = useQuery({ queryKey: ['authUser'] })

  useEffect(() => {
    if (authUser) {
      const socket = io('http://localhost:3000', {
        query: {
          userId: authUser._id,
        },
      })
      setSocket(socket)
      // socket.on() is used to add listener to the specified event. can be used both on client and server side
      socket.on('getOnlineUsers', (users: string[]) => {
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
