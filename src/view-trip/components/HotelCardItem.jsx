import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({ hotel }) {

    const[photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
        hotel && GetPlacePhoto();
    },[hotel])
    const GetPlacePhoto = async ()=>{
        const data = {
            textQuery:`${hotel?.hotelName}, ${hotel?.hotelAddress}`
        }
        const result = await GetPlaceDetails(data).then((resp)=>{
            console.log(resp.data.places[0].photos[3].name);

            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);

            setPhotoUrl(PhotoUrl);
            console.log(PhotoUrl);
        })
    }

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + "," + hotel?.hotelAddress} target='_blank' className='no-underline text-black hover:text-black'>
            <div className='border rounded-xl p-3 mt-2 hover:scale-110 transition-all cursor-pointer hover:shadow-md'>
                <img src={photoUrl?photoUrl:'/placeholder.jpg'} className='rounded-xl h-[200px] w-full object-cover' />


                <div className='my-3 flex flex-col'>
                    <h2 className='font-medium '>{hotel?.hotelName}</h2>
                    <h2 className='text-xs text-[#7139f4]'>📍{hotel?.hotelAddress}</h2>
                    <h2 className='text-sm mt-5'>💸{hotel?.price}</h2>
                    <h2 className="text-sm font-medium">⭐{hotel?.rating}/5</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem
