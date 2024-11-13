import React, { useState, useEffect } from 'react';
import PlaceItem from './PlaceItem';

function PlacesToVisit({ trip }) {
    const [estimatedBudget, setEstimatedBudget] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('$'); // Default to USD
    const [convertedBudget, setConvertedBudget] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');


    const currencyRates = {
        USD: { rate: 1, symbol: '$' },
        EUR: { rate: 0.85, symbol: '€' },
        GBP: { rate: 0.75, symbol: '£' }, // Added Pounds
        INR: { rate: 74, symbol: '₹' },
        JPY: { rate: 110, symbol: '¥' },
        AUD: { rate: 1.35, symbol: 'A$' },
        AED: { rate: 3.67, symbol: 'د.إ' }, // Added Dirham (AED)
        THB: { rate: 33.5, symbol: '฿' }, // Added Baht (THB)
        PKR: { rate: 290, symbol: '₨' }, // Added Pakistan Rupee (PKR)
        IDR: { rate: 15300, symbol: 'Rp' }, // Added Indonesian Rupee (IDR)
        MYR: { rate: 4.5, symbol: 'RM' }, // Added Ringgit (MYR)
        SGD: { rate: 1.35, symbol: 'S$' }, // Added Singapore Dollar (SGD)
        CAD: { rate: 1.36, symbol: 'CA$' }, // Added Canadian Dollar (CAD)
    };

    // Helper function to parse cost strings and detect currency
    const parseCost = (costString) => {
        if (costString.includes("Free") || costString.includes("Varies")) {
            return 0; // Treat 'Free' and 'Varies' as zero cost
        }

        const match = costString.match(/\$?₹?€?£?¥?(\d+)(?:\s*-\s*\$?₹?€?£?¥?(\d+))?/);
        if (match) {
            const [, low, high] = match.map(Number);
            return high ? (low + high) / 2 : low; // Return average if range, otherwise single value
        }

        return 0; // Default to 0 if unable to parse
    };

    useEffect(() => {
        if (trip) {
            const hotelBudget = trip.tripData?.hotels.reduce((sum, hotel) => {
                return sum + parseCost(hotel.price);
            }, 0);

            const activityBudget = trip.tripData?.itinerary.reduce((total, item) => {
                return total + item.plan.reduce((sum, place) => sum + parseCost(place.ticketPricing), 0);
            }, 0);

            setEstimatedBudget(hotelBudget + activityBudget);
            setConvertedBudget(hotelBudget + activityBudget); // Initialize with USD budget
        }
    }, [trip]);

    // Handle currency conversion
    const handleConvertCurrency = () => {
        const { rate, symbol } = currencyRates[selectedCurrency];
        if (rate) {
            setConvertedBudget((estimatedBudget * rate).toFixed(2));
            setCurrencySymbol(symbol);
        }
    };

    return (
        <div>
              {/* Display the estimated budget card with currency conversion */}
              {convertedBudget > 0 && (
                <div className="mt-8 mb-6 p-6 bg-[#f4f6fc] rounded-xl shadow-md text-center border border-gray-300">
                    <h3 className="font-semibold text-xl text-[#7139f4]">
                        💰 Estimated Budget for Trip
                    </h3>
                    <p className="text-2xl font-extrabold text-[#3a1f7a] mt-2">
                        {currencySymbol} {convertedBudget}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        This includes average hotel and activity costs.
                    </p>

                    <div className="mt-4">
                        <label htmlFor="currency" className="block text-gray-700">Convert to:</label>
                        <select
                            id="currency"
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700" // Light background
                        >
                            {Object.keys(currencyRates).map((currency) => (
                                <option key={currency} value={currency}>
                                    {currencyRates[currency].symbol} - {currency}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleConvertCurrency}
                            className="ml-2 px-4 py-2 bg-[#7139f4] text-white rounded-md"
                        >
                            Convert
                        </button>
                    </div>
                </div>
            )}
            <hr className='mt-12' />
            <h2 className='font-bold text-xl mt-8'>🏙️🎒Epic Escapes: Journey Beyond</h2>

            <div>
               


                {trip?.tripData?.itinerary.map((item, index) => (
                    <div key={index} className='border border-gray-300 rounded-xl px-8 py-5 cursor-pointer hover:shadow-md mt-14'>
                        <h2 className='font-semibold text-2xl mt-5 mb-5 tracking-wide' style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
                            Day <span className='text-[#7139f4] text-4xl font-extrabold'>{item.day}</span>
                        </h2>

                        <div className='grid md:grid-cols-2 gap-5'>
                            {item.plan.map((place, idx) => (
                                <div key={idx}>
                                    <h2 className='font-medium text-sm text-[#7139f4]'>{place.bestTime} ({place.timeRange})</h2>
                                    <PlaceItem place={place} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
    );
}

export default PlacesToVisit;
