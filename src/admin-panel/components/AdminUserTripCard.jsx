import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import { IoIosCloseCircleOutline } from "react-icons/io";

function AdminUserTripCard({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // New state for dialog

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true); // Show confirmation dialog
  };

  const confirmDelete = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    // Log user for debugging
    console.log("Logged in user: ", user);
  
    if (!user) {
      // If no user is found in localStorage
      toast.error('You need to be logged in to perform this action!');
      return;
    }
  
    debugger;
    // Check if the logged-in user's email matches the authorized one
    if (user.email !== 'niketchawla983@gmail.com') {
      // If the logged-in user's email doesn't match, show error message
      toast.error('You are not authorized to perform this action!');
      return;
    }
    
    if (trip?.id) {
      try {
        const tripRef = doc(db, "AITrips", trip.id);
        await deleteDoc(tripRef);
        toast.success("Trip Deleted Successfully");
        onDelete(trip.id); // Update parent state
        setShowDeleteDialog(false); // Close the dialog
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false); // Close the dialog without deleting
  };

  return (
    <div className='flex flex-col items-center justify-center border rounded-xl p-3 mt-2 cursor-pointer hover:shadow-md'>
      <img src={photoUrl ? photoUrl : '/placeholder.jpg'} alt="" className='h-[270px] w-[350px] object-cover rounded-xl' />

      <div>
        <h2 className='text-2xl mt-2 text-black'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-xs font-bold text-[#7139f4]'>
          {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} budget
        </h2>

        <Link to={'/view-trip/' + trip?.id}>
          <Button className="mt-5 w-[150px] bg-[#7139f4] hover:bg-[#45278b]">
            <FaArrowTrendUp /> Trip Details
          </Button>
        </Link>
        <Button onClick={handleDeleteClick} className="mt-5 ml-3 w-[150px] bg-red-600 hover:bg-red-800 hover:border-white">
          <MdDelete /> Delete Trip
        </Button>
      </div>

      {/* Custom Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this trip?</p>
            <div className="flex justify-end">
              <Button onClick={cancelDelete} className="mr-2 bg-gray-300 text-black hover:bg-gray-300 hover:border-whi">
              <IoIosCloseCircleOutline/> Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-800 text-white hover:border-white">
              <MdDelete /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserTripCard;
