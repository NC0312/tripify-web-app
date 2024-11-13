import React, { useState, useEffect } from 'react';
import PlaceItem from './PlaceItem';

function PlacesToVisit({ trip }) {
    const [estimatedBudget, setEstimatedBudget] = useState(0);

    // Helper function to parse cost strings
    const parseCost = (costString) => {
        if (costString.includes("Free") || costString.includes("Varies")) {
            return 0; // Treat 'Free' and 'Varies' as zero cost
        }

        const match = costString.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?/); // Match single or range values
        if (match) {
            const [ , low, high ] = match.map(Number);
            return high ? (low + high) / 2 : low; // Return average if range, otherwise single value
        }

        return 0; // Default to 0 if unable to parse
    };

    useEffect(() => {
        if (trip) {
            // Calculate hotel budget: sum up all hotel prices (averaging if range)
            const hotelBudget = trip.tripData?.hotels.reduce((sum, hotel) => {
                return sum + parseCost(hotel.price);
            }, 0);

            // Calculate activity budget: sum up all ticket prices from places in the itinerary
            const activityBudget = trip.tripData?.itinerary.reduce((total, item) => {
                return total + item.plan.reduce((sum, place) => sum + parseCost(place.ticketPricing), 0);
            }, 0);

            // Set the total estimated budget
            setEstimatedBudget(hotelBudget + activityBudget);
        }
    }, [trip]);

    return (
        <div>
            <hr className='mt-12'/>
            <h2 className='font-bold text-xl mt-8'>🏙️🎒Epic Escapes: Journey Beyond</h2>

            <div>
                {trip?.tripData?.itinerary.map((item, index) => (
                    <div className='border border-gray-300 rounded-xl px-8 py-5 cursor-pointer hover:shadow-md mt-14'>
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
            </div>

            {/* Display the estimated budget card */}
            {estimatedBudget > 0 && (
                <div className="mt-8 mb-6 p-6 bg-[#f4f6fc] rounded-xl shadow-md text-center border border-gray-300">
                    <h3 className="font-semibold text-xl text-[#7139f4]">
                        💰 Estimated Budget for Trip
                    </h3>
                    <p className="text-2xl font-extrabold text-[#3a1f7a] mt-2">
                        ${estimatedBudget.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        This includes average hotel and activity costs.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PlacesToVisit;
