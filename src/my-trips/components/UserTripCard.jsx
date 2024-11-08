import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCard({trip}) {

  const[photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
        trip && GetPlacePhoto();
    },[trip])
    const GetPlacePhoto = async ()=>{
        const data = {
            textQuery:trip?.userSelection?.location?.label
        }
        const result = await GetPlaceDetails(data).then((resp)=>{
            console.log(resp.data.places[0].photos[0].name);

            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[1].name);

            setPhotoUrl(PhotoUrl);
            console.log(PhotoUrl);
        })
    }

  return (
    <Link to={'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all'>
      <img src={photoUrl?photoUrl:'/placeholder.jpg'} alt="" className=' h-[300px] w-[300px] object-cover rounded-xl'/>

      <div>
        <h2 className='text-2xl mt-2 text-black'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-xs font-bold text-[#7139f4]'>{trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} budget</h2>
      </div>
    </div>
    </Link>
  )
}

export default UserTripCard
