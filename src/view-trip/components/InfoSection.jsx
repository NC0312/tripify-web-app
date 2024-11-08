import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { MdOutlineLink } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from 'sonner';


const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function InfoSection({ trip }) {
    const [photoUrls, setPhotoUrls] = useState([]); // Array to store all photo URLs
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Index for the current photo

    useEffect(() => {
        if (trip) {
            trip&&GetPlacePhotos();
        }
    }, [trip]);

    const GetPlacePhotos = async () => {
        const data = {
            textQuery: trip?.userSelection?.location?.label
        };
        const result = await GetPlaceDetails(data);

        // Generate URLs for each photo and store in photoUrls array
        const urls = result.data.places[0].photos.slice(0, 10).map(photo => 
            PHOTO_REF_URL.replace('{NAME}', photo.name)
        );

        setPhotoUrls(urls);
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photoUrls.length) % photoUrls.length);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                toast.success("Trip Link Copied"); // Shows a success toast message
            })
            .catch((error) => {
                console.error("Error copying link:", error);
            });
    };

    return (
        <div>
        
            {/* Carousel Display */}
            <div className="relative h-[570px] w-full">
                {photoUrls.length > 0 && (
                    <img
                        src={photoUrls[currentPhotoIndex]}
                        alt="Carousel Image"
                        className="h-[570px] w-full object-cover rounded-xl"
                    />
                )}

                {/* Carousel Controls */}
                <button onClick={prevPhoto} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2">
                    <FaArrowLeft />
                </button>
                <button onClick={nextPhoto} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2">
                    <FaArrowRight />
                </button>
            </div>

            <div className='flex justify-between items-center'>
                <div className='my-5 flex flex-col gap-2'>
                    <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>

                    <div className='flex gap-5'>
                        <h2 className='p-1 px-3 bg-[#7139f4] rounded-full text-white text-md'>📅{trip.userSelection?.noOfDays} Days</h2>
                        <h2 className='p-1 px-3 bg-[#7139f4] rounded-full text-white text-md'>💰{trip.userSelection?.budget}</h2>
                        <h2 className='p-1 px-3 bg-[#7139f4] rounded-full text-white text-md'>🍻{trip.userSelection?.people}</h2>
                    </div>
                </div>

                <Button onClick={handleCopyLink}><MdOutlineLink  /></Button>
            </div>
        </div>
    );
}

export default InfoSection;
