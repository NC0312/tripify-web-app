import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import UserTripCard from './components/UserTripCard';
import { Search } from 'lucide-react';

function MyTrips() {
  const navigation = useNavigation();
  const [userTrips, setUserTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  useEffect(() => {
    // Filter trips based on location label
    const filtered = userTrips.filter((trip) =>
      trip?.userSelection?.location?.label
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredTrips(filtered);
  }, [searchTerm, userTrips]);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigation('/');
      return;
    }
    setUserTrips([]);
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const tripData = doc.data();
      tripData.id = doc.id; // Preserve the document ID for the Link routing
      setUserTrips(prevVal => [...prevVal, tripData]);
    });
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='font-bold text-3xl'>My Trips</h2>
        <div className='relative'>
          <input
            type="text"
            placeholder="Browse your saved escapes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#7139f4] bg-white shadow-sm'
          />
          <Search className='absolute left-3 top-2.5 text-gray-400 h-5 w-5' />
        </div>
      </div>
      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {filteredTrips.length > 0 
          ? filteredTrips.map((trip, index) => (
              <UserTripCard 
                trip={trip} 
                key={index}
              />
            ))
          : searchTerm 
            ? <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No destinations found matching "{searchTerm}"</p>
              </div>
            : [1, 2, 3, 4, 5, 6].map((item, index) => (
                <div 
                  key={index} 
                  className='h-[300px] w-[300px] bg-slate-200 animate-pulse rounded-xl'
                />
              ))
        }
      </div>
    </div>
  );
}

export default MyTrips;