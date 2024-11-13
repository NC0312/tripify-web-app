import { db } from '@/service/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';  // Importing toast for error messages
import AdminUserTripCard from './components/AdminUserTripCard';
import { MdDelete } from "react-icons/md";
import { Button } from '@/components/ui/button';

function AdminPanel() {
    const [userTrips, setUserTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [tripCount, setTripCount] = useState(0);  // New state for trip count

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
        setUserTrips([]);
        const querySnapshot = await getDocs(collection(db, 'AITrips'));
        const trips = [];
        querySnapshot.forEach((doc) => {
            const tripData = doc.data();
            tripData.id = doc.id; // Preserve the document ID for the Link routing
            trips.push(tripData);
        });
        setUserTrips(trips);
        setTripCount(trips.length);  // Update trip count
    };

    const handleDelete = async (tripId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast.error('You need to be logged in to perform this action!');
            return;
        }
        if (user.email !== 'niketchawla983@gmail.com') {
            toast.error('You are not authorized to perform this action!');
            return;
        }
        try {
            const tripDocRef = doc(db, 'AITrips', tripId);
            await deleteDoc(tripDocRef);
            setUserTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
            setTripCount(prevCount => prevCount - 1);  // Decrement trip count
            toast.success('Trip deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete trip!');
        }
    };

    const handleDeleteAll = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email !== 'niketchawla983@gmail.com') {
            toast.error('You are not authorized to perform this action!');
            return;
        }

        try {
            const querySnapshot = await getDocs(collection(db, 'AITrips'));
            const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, 'AITrips', docSnap.id)));
            await Promise.all(deletePromises);
            setUserTrips([]);
            setTripCount(0);  // Reset trip count
            toast.success('All trips deleted successfully!');
        } catch (error) {
            console.error("Error deleting trips: ", error);
            toast.error('Failed to delete trips!');
        }
    };

    return (
        <div className='sm:px-10 md:px-55 lg:px-95 xl:px-100 px-5 mt-10'>
            <div className='flex justify-between items-center mb-8'>
                <h2 className='font-bold text-3xl'>👨‍💻 Admin Panel</h2>

                <div className='flex flex-row justify-around space-x-4'>
                    <Button
                        className="mt-1 w-[200px] bg-[#7139f4] text-white text-lg cursor-default pointer-events-none"
                    >
                        Trip Count: {tripCount}
                    </Button>


                    <Button
                        onClick={handleDeleteAll}
                        className='mt-1 w-[200px] bg-red-600 text-white hover:bg-red-800 hover:border-white'
                    >
                        <MdDelete /> Delete All Trips
                    </Button>

                    {/* Search Bar */}
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Browse all trips..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#7139f4] bg-white shadow-sm'
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400 h-5 w-5' />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 mt-10 md:grid-cols-4 gap-5 border-black'>
                {filteredTrips.length > 0
                    ? filteredTrips.map((trip, index) => (
                        <AdminUserTripCard
                            trip={trip}
                            key={index}
                            onDelete={() => handleDelete(trip.id)}
                        />
                    ))
                    : searchTerm
                        ? <div className="col-span-full text-center py-10">
                            <p className="text-gray-500">No destinations found matching "{searchTerm}"</p>
                        </div>
                        : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                            <div
                                key={index}
                                className='h-[250px] w-[220px] bg-slate-200 animate-pulse rounded-xl flex flex-col justify-center text-center'
                            ><p>No data available bro 😲</p>
                            </div>
                        ))
                }
            </div>
        </div>
    );
}

export default AdminPanel;
