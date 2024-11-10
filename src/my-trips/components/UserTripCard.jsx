import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';


function UserTripCard({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[1].name);
      setPhotoUrl(PhotoUrl);
    });
  };

  const handleDeleteClick = async () => {
    if (trip?.id) {
      try {
        const tripRef = doc(db, "AITrips", trip.id); // Adjust to the correct collection name
        await deleteDoc(tripRef);
        toast.success("Trip Deleted Successfully")
        console.log("Trip deleted successfully");
        onDelete(trip.id); // Call onDelete prop to update parent state
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center border rounded-xl p-3 mt-2 cursor-pointer hover:shadow-md'>
      <img src={photoUrl ? photoUrl : '/placeholder.jpg'} alt="" className='h-[270px] w-[350px] object-cover rounded-xl' />

      <div>
        <h2 className='text-2xl mt-2 text-black'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-xs font-bold text-[#7139f4]'>
          {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} budget
        </h2>

        {/* <div className='flex flex-row items-center justify-center'> */}
          <Link to={'/view-trip/' + trip?.id}>
            <Button className="mt-5 w-[150px] bg-[#7139f4] hover:bg-[#45278b]">
              <FaArrowTrendUp /> Trip Details
            </Button>
          </Link>
          <Button onClick={handleDeleteClick}  className="mt-5 ml-3 w-[150px] bg-red-600 hover:bg-red-800 hover:border-white">
            <MdDelete /> Delete Trip
          </Button>
        {/* </div> */}
      </div>
    </div>
  );
}

export default UserTripCard;