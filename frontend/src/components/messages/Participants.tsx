import Participant from './Participant'

interface Props {
  participants: User[]
}

const Participants = ({ participants }: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      {participants.map((participant: User) => (
        <Participant key={participant._id} participant={participant} />
      ))}
    </div>
  )
}

export default Participants