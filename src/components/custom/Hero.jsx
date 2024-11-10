import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  const images = [
    "/home-landing-image.png",
    "/landing-image-1.png",
    "/landing-image-2.png",
    "/landing-image-3.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically slide images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 2000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center text-center gap-9'>
        <h3 className='font-extrabold text-[50px] text-center mt-16'>
          <span className='text-[#7139f4]'>Plan your perfect getaway with Tripify:</span> <br />your AI-powered travel companion.
        </h3>

        <p className='text-xl text-gray-500 text-center'>
          Discover new destinations, create personalized itineraries, and explore like never before with our intelligent travel solutions.
        </p>

        <Link to={'/create-trip'}>
          <Button className="bg-[#7139f4] hover:bg-[#4a2997]">Start Your Adventure!</Button>
        </Link>
      </div>

      <div className='relative flex flex-col items-center justify-center mt-7'>
        <div className='relative w-[650px] h-[350px] overflow-hidden rounded-xl border border-gray-400 p-3 hover:shadow-md'>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
          />
        </div>

        <div className='absolute flex items-center justify-around w-full top-1/2 transform -translate-y-1/2 px-4'>
          <button
            onClick={handlePrev}
            className='bg-white p-2 rounded-full shadow-lg text-[#7139f4] hover:bg-gray-200 focus:outline-none'
          >
            ❮
          </button>
          <button
            onClick={handleNext}
            className='bg-white p-2 rounded-full shadow-lg text-[#7139f4] hover:bg-gray-200 focus:outline-none'
          >
            ❯
          </button>
        </div>
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-[#7139f4]' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
    </>
  );
}

export default Hero;
