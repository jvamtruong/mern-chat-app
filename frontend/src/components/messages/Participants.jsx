import React from 'react'
import Participant from './Participant'

const Participants = ({ participants }) => {
  return (
    <div className='flex flex-col gap-1'>
      {
        participants.map(participant => (
          <Participant key={participant._id} participant={participant} />
        ))
      }
    </div>
  )
}

export default Participants
