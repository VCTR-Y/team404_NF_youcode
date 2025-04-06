import { Link } from 'react-router-dom'; // lets you create internal links without reloading the page (click the button and go to a new page)
import { Button } from '@/components/ui/button'; // (standard UI library) designs the button to standardize all button styles across your app
import foodSharing from '/images/IMG_4516.jpg'; // Path to the image

export function PlatefulLandingPage() { // a React function component
  return ( // output (JSX) of your component begins
    
    <div className="min-h-screen flex flex-col justify-between m-0 p-0"> 
      {/* Text section - centered vertically */}
      <div className="flex flex-col justify-center items-center flex-grow text-center">
        <div className="flex justify-around items-center w-full mb-8"> 
          <div className="text-4xl font-bold">
            <span className="text-primary">Plateful</span>
          </div>

          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
        
        <div className="flex flex-col justify-center items-center mt-8">
          <h1 className="text-4xl font-bold mb-4">
            Donate or Receive Food with Plateful
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            A community-powered foodbank that connects food donors with those who need it.
            Donors can upload extra food, and receivers can browse available items nearby.
          </p>
        </div>
      </div>

      {/* Image section - takes up the bottom part of the screen */}
      <div className="w-full h-96 md:h-screen">
        <img
          src={foodSharing}
          alt="Food Sharing"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}