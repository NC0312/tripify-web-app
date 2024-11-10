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
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
    const [place, setPlace] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
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

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    });

    const OnGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true);
            return;
        }
        if (!formData.location || !formData.noOfDays || !formData.budget || !formData.people) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (parseInt(formData.noOfDays, 10) > 15) {
            toast.error("Please make the trip less than 15 days.");
            return;
        }

        setLoading(true);
        toast("Our AI is working on it!", {
            description: "Generating your perfect trip...",
            duration: 5000,
        });

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{people}', formData?.people)
            .replace('{budget}', formData?.budget);

        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const tripData = await result?.response?.text();
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
            savedDoc.exists() ? toast.success("Trip saved successfully!") : toast.error("Failed to save trip data!");
        } catch (error) {
            toast.error("Failed to save trip data: " + error.message);
        }
    };

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialog(false);
            OnGenerateTrip();
        });
    };

    return (
        <div className="flex flex-col items-center px-48 mt-10">
            <h2 className="font-bold text-3xl mb-3 text-center">
                Share Your <span className="text-[#7139f4]"> Dream Trip</span> Details 🏕️🏨
            </h2>
            <p className="text-gray-500 text-lg mb-8 text-center">
                Tell us about your dream travel plans, and let Tripify's AI create the perfect itinerary tailored just for you!
            </p>

            {/* Trip Inputs */}
            <div className="space-y-8 w-full">
                <div className='flex flex-row justify-center gap-20'>
                    <div>
                        <h2 className="text-lg mb-3 font-medium text-gray-800">If you could escape anywhere right now, where would it be?</h2>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                            selectProps={{
                                place,
                                onChange: (v) => { setPlace(v); handleInputChange('location', v); }
                            }}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg mb-3 font-medium text-gray-800">How many days are you ready to leave your worries behind?</h2>
                        <Input 
                            placeholder="Up to 15 days"
                            type="number"
                            max={15}
                            value={formData.noOfDays || ""}
                            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-lg mb-3 font-medium text-gray-800">What’s your budget for this trip? Don’t worry, our AI won’t spill the beans to your wallet!</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {SelectBudgetOptions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('budget', item.title)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition ${formData?.budget === item.title ? 'border-[#7139f4] bg-[#7139f4] text-white' : 'bg-white'}`}
                            >
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="font-bold mt-2">{item.title}</h2>
                                <p className="text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg mb-3 font-medium text-gray-800">Who will be your partner(s) in crime on this adventure?</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {SelectTravelesList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('people', item.people)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition ${formData?.people === item.people ? 'border-[#7139f4] bg-[#7139f4] text-white' : 'bg-white'}`}
                            >
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="font-bold mt-2">{item.title}</h2>
                                <p className="text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wrapper div for aligning the button */}
            <div className="relative w-full mt-20">
                <Button
                    onClick={OnGenerateTrip}
                    disabled={loading}
                    className="absolute bottom-0 right-0 bg-[#7139f4] hover:bg-[#4a2997] text-white px-6 py-3 shadow-lg"
                >
                    {loading ? <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" /> : 'Generate Trip'}
                </Button>
            </div>


            {/* Dialog for Login */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div className="flex flex-col items-center justify-center">
                                <img className="h-12 w-auto" src='/tripify-logo.png' alt="Tripify Logo" />
                                <h2 className="text-xl font-bold mt-6 text-center">Sign In to Continue</h2>
                                <p className="text-center mt-2">Sign in with Google to generate your personalized trip.</p>
                                <Button onClick={login} className="flex items-center justify-center mt-6 gap-4 w-48 bg-white border hover:bg-gray-100">
                                    <FcGoogle size={22} />
                                    Continue with Google
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTrip;
