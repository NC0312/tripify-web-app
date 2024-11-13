import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip'
import Header from './components/custom/Header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripId]'
import Footer from './view-trip/components/Footer'
import MyTrips from './my-trips'
import AdminPanel from './admin-panel'


const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element:<CreateTrip/>
  },
  {
    path:'/view-trip/:tripId',
    element:<ViewTrip/>
  },
  {
    path:'my-trips',
    element:<MyTrips/>
  },
  {
    path: '/admin-panel', // Random admin route
    element: <AdminPanel/> // Admin Panel Component
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <Header/>
    <Toaster/>
    <RouterProvider router={router} />
    </GoogleOAuthProvider>
    <Footer/>
  </StrictMode>
);

