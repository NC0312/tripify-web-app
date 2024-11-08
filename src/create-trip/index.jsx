import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';



function CreateTrip() {
    const [place, setPlace] = useState(null);
    const [openDailog, setOpenDailog] = useState(false);
    const [formData, setFormData] = useState({});

    const [loading, setLoading] = useState(false);

    const router = useNavigate();

    const handleInputChange = (name, value) => {
        const parsedValue = name === 'noOfDays' ? parseInt(value, 10) : value;

        if (name === 'noOfDays' && parsedValue > 15) {
            toast("Please make the trip less than 15 days.");
            return;
        }

        setFormData({
            ...formData,
            [name]: parsedValue
        });
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    })



    const OnGenerateTrip = async () => {
        const user = localStorage.getItem('user');

        if (!user) {
            setOpenDailog(true);
            return;
        }

        if (!formData.location || !formData.noOfDays || !formData.budget || !formData.people) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // if (formData.noOfDays > '15') {
        //     toast.error("Please make the trip less than 15 days.");
        //     return;
        // }

        if (parseInt(formData.noOfDays, 10) > 15) {
            toast.error("Please make the trip less than 15 days.");
            return;
        }

        setLoading(true);
        // Show the toast while the AI is working
        toast("Our AI is working on it!!!", {
            description: "Generating your perfect trip...",
            duration: 5000,  // You can adjust the duration here
        });

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{people}', formData?.people)
            .replace('{budget}', formData?.budget);

        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);

            const tripData = await result?.response?.text();
            console.log(tripData);

            await SaveAiTrip(tripData);
        } catch (error) {
            console.error("Error generating trip:", error);
        } finally {
            setLoading(false);
        }
    };


    const SaveAiTrip = async (TripData) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const docId = Date.now().toString();

            const docRef = doc(db, "AITrips", docId);

            await setDoc(docRef, {
                userSelection: formData,
                tripData: JSON.parse(TripData),
                userEmail: user?.email,
                id: docId
            });

            router('/view-trip/' + docId);

            const savedDoc = await getDoc(docRef);
            if (savedDoc.exists()) {
                console.log("Data saved successfully!");
                toast.success("Trip saved successfully!");
            } else {
                console.error("Data not saved!");
                toast.error("Failed to save trip data!");
            }

        } catch (error) {
            console.error("Error saving trip:", error);
            toast.error("Failed to save trip data: " + error.message);
        }
    };

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
            OnGenerateTrip();
        })
    }

    return (
        <div className='flex flex-col items-center sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 relative'>
            <h2 className='font-bold text-3xl'>Share Your <span className='text-[#7139f4]'> Dream Trip</span> Details🏕️🏨</h2>
            <p className='mt-3 text-gray-500 text-xl'>Tell us about your dream travel plans, and let Tripify's AI work its magic to create the perfect itinerary tailored just for you!</p>

            <div className='flex flex-col items-center justify-center gap-9 mt-10'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>If you could escape anywhere right now, where would it be?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handleInputChange('location', v); }
                        }}
                    />
                </div>

                <div>
                    <h2 className='text-xl my-3 font-medium'>How many days are you ready to leave your worries behind?</h2>
                    {/* <Input
                        placeholder={'Ex. 3 Days'}
                        type="number"
                        onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                    /> */}
                    <Input
                        placeholder="3 Days (Keep your trip range within 15 Days)"
                        type="number"
                        max={15} // Set max value directly in the input field
                        value={formData.noOfDays || ""} // Ensure controlled input
                        onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                    />
                </div>

                <div>
                    <h2 className='text-xl my-3 font-medium'>What’s your budget for this trip? Don’t worry, our AI won’t spill the beans to your wallet!</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {SelectBudgetOptions.map((item, index) => (
                            <div key={index}
                                onClick={() => handleInputChange('budget', item.title)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg  border-black bg-[#7139f4] text-white'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg mt-3'>{item.title}</h2>
                                <h2 className='text-sm'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className='text-xl my-3 font-medium'>Who will be your partner(s) in crime on this adventure?</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {SelectTravelesList.map((item, index) => (
                            <div key={index}
                                onClick={() => handleInputChange('people', item.people)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg mb-7 ${formData?.people === item.people && 'shadow-lg border-black bg-[#7139f4] text-white'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg mt-3'>{item.title}</h2>
                                <h2 className='text-sm'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='absolute bottom-4 right-20'>
                <Button onClick={OnGenerateTrip} disabled={loading}>
                    {
                        loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
                    }
                </Button>
            </div>

            <Dialog open={openDailog}>

                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div className='flex flex-row items-center'>
                                <img className="h-12 w-auto" src='/tripify-logo.png' />
                                <h2 className='text-2xl font-bold text-black'>Tripify</h2>
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
    );
}

export default CreateTrip;
