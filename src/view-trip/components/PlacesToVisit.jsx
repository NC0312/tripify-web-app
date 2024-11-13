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
        GBP: { rate: 0.75, symbol: '£' },
        INR: { rate: 74, symbol: '₹' }, // Conversion rate to USD
        JPY: { rate: 110, symbol: '¥' },
        AUD: { rate: 1.35, symbol: 'A$' },
        AED: { rate: 3.67, symbol: 'د.إ' },
        THB: { rate: 33, symbol: '฿' },
        PKR: { rate: 168, symbol: '₨' },
        IDR: { rate: 14350, symbol: 'Rp' },
        MYR: { rate: 4.17, symbol: 'RM' },
        SGD: { rate: 1.36, symbol: 'S$' },
        CAD: { rate: 1.25, symbol: 'CA$' },
    };

    // Helper function to parse cost strings and convert to USD
    const parseCost = (costString) => {
        if (costString.includes("Free") || costString.includes("Varies")) {
            return 0;
        }

        const match = costString.match(/(₹|\$|€|£|¥)?(\d+)(?:\s*-\s*(\d+))?/);
        if (match) {
            const [, symbol, low, high] = match;
            const averageCost = high ? (parseInt(low) + parseInt(high)) / 2 : parseInt(low);

            // Detect currency and convert to USD base
            let rate = 1;
            if (symbol) {
                rate = Object.values(currencyRates).find(rateObj => rateObj.symbol === symbol)?.rate || 1;
            }
            return averageCost / rate;
        }

        return 0;
    };

    useEffect(() => {
        if (trip) {
            const hotelBudget = trip.tripData?.hotels.reduce((sum, hotel) => {
                return sum + parseCost(hotel.price);
            }, 0);

            const activityBudget = trip.tripData?.itinerary.reduce((total, item) => {
                return total + item.plan.reduce((sum, place) => sum + parseCost(place.ticketPricing), 0);
            }, 0);

            const totalBudget = hotelBudget + activityBudget;
            setEstimatedBudget(totalBudget); // Store USD base
            setConvertedBudget(totalBudget); // Initialize with USD budget
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
            {convertedBudget > 0 && (
                <div className="mt-8 mb-6 p-6 bg-[#f4f6fc] rounded-xl shadow-md text-center border border-gray-300">
                    <h3 className="font-semibold text-xl text-[#7139f4]">
                        💰 Estimated Budget for Trip
                    </h3>
                    <p className="text-2xl font-extrabold text-[#3a1f7a] mt-2">
                        {currencySymbol} {new Intl.NumberFormat('en-IN').format(convertedBudget)}
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
                            className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700"
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
