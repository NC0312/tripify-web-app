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
import { FaSuitcaseRolling } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { SlLogin } from "react-icons/sl";
import { IoIosCloseCircleOutline } from "react-icons/io";


function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [openDailog, setOpenDailog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);


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

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    window.location.reload();
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
                {/* Keep the buttons outside the popover */}
                <a href='/' target='_self'>
                  <Button variant="outline" className="text-black hover:border-black rounded-full flex items-center gap-2"><FaHome />Home</Button>
                </a>

                <a href='/create-trip' target="_self">
                  <Button variant="outline" className="text-black hover:border-black rounded-full">+ Create Trip</Button>
                </a>

                <a href='/my-trips' target="_self">
                  <Button variant="outline" className="text-black hover:border-black rounded-full"><FaSuitcaseRolling /> Saved Trips</Button>
                </a>


                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-0 border-none bg-transparent">
                      <img className="h-[40px] w-[40px] rounded-full" src={user.picture} alt={user.name} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-[#D9D9D9] hover:cursor-pointer p-4 rounded-lg flex flex-col gap-2">
                    {/* Duplicate of links inside the popover */}
                    <a href='/' target='_self' className="w-full">
                      <Button variant="outline" className="text-black hover:text-gray-700 rounded-full w-full flex justify-center items-center">
                        <FaHome className="mr-2" />Home
                      </Button>
                    </a>
                    <a href='/create-trip' target="_self" className="w-full">
                      <Button variant="outline" className="text-black hover:text-gray-700 rounded-full w-full">
                        + Create Trip
                      </Button>
                    </a>
                    <a href='/my-trips' target="_self" className="w-full">
                      <Button variant="outline" className="text-black hover:text-gray-700 rounded-full w-full">
                        <FaSuitcaseRolling /> Saved Trips
                      </Button>
                    </a>

                    <Button
                      variant="outline"
                      className="text-black hover:text-gray-700 rounded-full w-full"
                      onClick={() => setOpenLogoutDialog(true)} // Open the confirmation dialog
                    >
                      <RiLogoutBoxLine /> Logout
                    </Button>
                  </PopoverContent>
                </Popover>

              </div>
            ) : (
              <Button className="bg-[#7139f4] hover:bg-[#4a2997]" onClick={() => setOpenDailog(true)}><SlLogin /> Login</Button>
            )
          }
        </div>


        {/* Logout Confirmation Dialog */}
        <Dialog open={openLogoutDialog}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                <p>Are you sure you want to log out?</p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-around mt-4">
              <Button variant="outline" onClick={() => setOpenLogoutDialog(false)}><IoIosCloseCircleOutline/> Cancel</Button>
              <Button className="bg-[#713f94] text-white hover:bg-[#562976]" onClick={handleLogout}><RiLogoutBoxLine /> Logout</Button>
            </div>
          </DialogContent>
        </Dialog>





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