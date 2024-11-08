import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceItem({ place }) {

    const[photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
        place && GetPlacePhoto();
    },[place])
    const GetPlacePhoto = async ()=>{
        const data = {
            textQuery:`${place?.placeName}, ${place?.placeAddress}`
        }
        const result = await GetPlaceDetails(data).then((resp)=>{
            console.log(resp.data.places[0].photos[3].name);

            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[1].name);

            setPhotoUrl(PhotoUrl);
            console.log(PhotoUrl);
        })
    }


    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query='+ place.placeName} target='_blank' className='no-underline text-black hover:text-black'>
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer hover:shadow-md'>
                <img src={photoUrl?photoUrl:'/placeholder.jpg'}
                    className='w-[130px] h-[130px] rounded-xl object-cover' />

                <div>
                    <h2 className='font-medium text-lg'>{place.placeName}</h2>
                    <p className='text-sm text-gray-500'>{place.placeDetails}</p>
                    <h2 className='mt-2 text-[#7139f4] text-sm font-bold'>🕙Time To Travel - {place.timeToTravel}</h2>
                    <h2 className=' text-sm font-bold'>💸Ticket Pricing - {place.ticketPricing}</h2>
                    <h2 className=' text-sm font-medium'>⭐{place.rating}/5</h2>


                    {/* <Button size='sm' className='mt-3 bg-[#7139f4] hover:bg-[#3d0ea9]'><FaArrowRightLong /></Button> */}


                </div>
            </div>
        </Link>
    )
}

export default PlaceItem
