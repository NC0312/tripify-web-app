import React from 'react'
import PlaceItem from './PlaceItem'

function PlacesToVisit({ trip }) {
    return (
        <div >
                <hr className='mt-12'/>
            <h2 className='font-bold text-xl mt-8'>🏙️🎒Epic Escapes: Journey Beyond</h2>



            <div>
                {trip.tripData?.itinerary.map((item, index) => (
                    <div className='border border-gray-300 rounded-xl px-8 py-5 cursor-pointer hover:shadow-md mt-14'>
                        {/* <h2 className='font-medium text-lg mt-5'>Day {item.day}</h2> */}
                        <h2 className='font-semibold text-2xl mt-5 mb-5 tracking-wide' style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
                            Day <span className='text-[#7139f4] text-4xl font-extrabold'>{item.day}</span>
                        </h2>

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

                {/* Display the estimated budget card */}
                {trip.tripData?.estimatedBudget && (
                    <div className="mt-8 mb-6 p-6 bg-[#f4f6fc] rounded-xl shadow-md text-center border border-gray-300">
                        <h3 className="font-semibold text-xl text-[#7139f4]">
                            💰 Estimated Budget for Trip
                        </h3>
                        <p className="text-2xl font-extrabold text-[#3a1f7a] mt-2">
                            {trip.tripData?.estimatedBudget}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            This includes average hotel and activity costs.
                        </p>
                    </div>
                )}
            </div>


        </div>
    )
}

export default PlacesToVisit
