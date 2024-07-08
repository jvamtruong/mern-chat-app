import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useGetConversations = () => {
	const [loading, setLoading] = useState(false)
	const [conversations, setConversations] = useState([])

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true)
			try {
				let res = await fetch("/api/users") // one on one chat
				const data1 = await res.json()

				if (data1.error) {
					throw new Error(data1.error)
				}
        // in progress
        // res = await fetch('/api/groups')
        // data.push(await res.json())
        // then sort by modified date
        res = await fetch('/api/groups')
        const data2 = await res.json()
        if (data2.error) {
          throw new Error(data2.error)
        }
				setConversations([...data1, ...data2])
			} catch (error) {
				toast.error(error.message)
			} finally {
				setLoading(false)
			}
		}

		getConversations()
	}, [])

	return { loading, conversations, setConversations }
}

export default useGetConversations