import React from 'react'
import PlaceItem from './PlaceItem'

function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-xl mt-12'>Epic Escapes: Journey Beyond</h2>



            <div>
                {trip.tripData?.itinerary.map((item, index) => (
                    <div>
                        <h2 className='font-medium text-lg mt-5'>Day {item.day}</h2>

                        <div className='grid md:grid-cols-2 gap-5'>
                            {item.plan.map((place, index) => (
                                <div>
                                    <h2 className='font-medium text-sm text-[#7139f4]'>{place.bestTime} ({place.timeRange})</h2>

                                    <PlaceItem place={place} />

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default PlacesToVisit
