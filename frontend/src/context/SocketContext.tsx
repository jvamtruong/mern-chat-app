import { createContext, useState, useEffect, useContext } from 'react'
import io, { Socket } from 'socket.io-client'
import { useQuery } from '@tanstack/react-query'

interface SocketContextType {
  socket: Socket | null
  onlineUsers: string[]
}

interface Props {
  children: React.ReactNode
}

const SocketContext = createContext<SocketContextType | null>(null)

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] })

  const URL =
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_BACKEND_URL_DEV
      : import.meta.env.VITE_BACKEND_URL_PROD

  useEffect(() => {
    if (authUser) {
      const socket: Socket = io(URL, {
        query: {
          userId: authUser._id,
        },
      })
      setSocket(socket)
      // socket.on() is used to add listener to the specified event. can be used both on client and server side
      socket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users)
      })

      return () => {
        socket.close()
      }
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
