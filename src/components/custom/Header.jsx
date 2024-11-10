import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";



function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [openDailog, setOpenDailog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?accesstoken=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      window.location.reload();
    })
  }


  return (
    <div className='p-3 shadow-sm flex flex-col items-start justify-between px-5 w-full'>
      <div className='flex items-center w-full'>
        <img src="/tripify-logo.png" alt="logo" className="h-12 w-auto" />
        <a href='/'>
        <div className='ml-2'>
          <h2 className='text-3xl font-bold text-black'>Tripify</h2>
          <h3 className='text-[10px] font-medium text-[#3a1f7a] ml-10 mt-1'>Beyond Destinations</h3>
        </div>
        </a>
        <div className='ml-auto'>
          {
            user && user.picture ? (
              <div className='flex items-center gap-5'>
                <a href='/' target='_self'>
                <Button variant="outline" className="text-black hover:border-black rounded-full"><FaHome />Home</Button>
                </a>

                <a href='/create-trip' target="_self">
                  <Button variant="outline" className="text-black hover:border-black rounded-full">+ Create Trip</Button>
                </a>

                <a href='/my-trips' target="_self">
                  <Button variant="outline" className="text-black hover:border-black rounded-full">My Trips</Button>
                </a>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-0 border-none bg-transparent">
                      <img className="h-[40px] w-[40px] rounded-full" src={user.picture} alt={user.name} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="hover:cursor-pointer hover:bg-[#D9D9D9]">
                    <h2 onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}>Logout</h2>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button className="bg-[#7139f4] hover:bg-[#4a2997]" onClick={() => setOpenDailog(true)}>Sign In</Button>
            )
          }
        </div>
        <Dialog open={openDailog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <div className='flex flex-row items-center'>
                  <img className="h-12 w-auto" src='/tripify-logo.png' />
                  <div className='ml-2'>
                    <h2 className='text-3xl font-bold text-black'>Tripify</h2>
                    <h3 className='text-[10px] font-medium text-[#3a1f7a] ml-10'>Beyond Destinations</h3>
                  </div>
                </div>

                <div className='flex flex-col items-center justify-center'>
                  <h2 className='font-bold text-lg text-gray-700 mt-7'>Sign In With Google</h2>
                  <p>Sign in to the App with Google Authentication</p>
                </div>

                <Button onClick={login} className='w-full mt-6'>
                  <FcGoogle /> Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Header