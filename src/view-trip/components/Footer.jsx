import React from 'react';
import { SiGooglegemini } from "react-icons/si";

function Footer() {
  return (
    <div className='my-7 flex flex-col items-center border-t border-gray-300 pt-5'>
      <h2 className='text-center text-lg text-gray-500 inline-flex items-center'>
        Created By <a href='https://niketchawla.vercel.app/' target='_blank' rel="noopener noreferrer"> 
          <span className='text-[#7139f4] text-lg font-bold mx-1'>Niket Chawla</span>
        </a> | Powered By 
        <a href='https://gemini.google.com/?hl=en-IN' target='_blank' rel="noopener noreferrer">
          <span className='text-[#7139f4] text-lg font-bold mx-1'> Google Gemini</span>
        </a>
        <SiGooglegemini className='text-[#7139f4] text-lg' />
      </h2>
    </div>
  );
}

export default Footer;
