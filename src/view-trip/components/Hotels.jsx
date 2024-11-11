import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  return (
    <div>
      <hr/>
      <h2 className='font-bold text-xl mt-5 my-5'>🏠🛏️Sleep Spots for Your Wander Soul</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <HotelCardItem hotel={hotel}/>
         
        ))}
      </div>
    </div>
  )
}

export default Hotels
