import { Link } from "react-router-dom"; // lets you create internal links without reloading the page (click the button and go to a new page)
import { Button } from "@/components/ui/button"; // (standard UI library) designs the button to standardize all button styles across your app
import foodSharing from "/images/IMG_4516.jpg"; // Path to the image

export function PlatefulLandingPage() {
  // a React function component
  return (
    // output (JSX) of your component begins

    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div className="flex justify-between items-center w-full p-6 bg-white">
        <div className="text-4xl text-black font-bold">Plateful</div>
        <Button>
          <Link to="/login">Login</Link>
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center text-center flex-grow px-4">
        <h1 className="text-5xl font-bold mt-12 mb-6 tracking-tight text-gray-800">
          Donate or Receive Food with Plateful
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A community-powered foodbank that connects food donors with those who
          need it. Donors can upload extra food, and receivers can browse
          available items nearby.
        </p>
        <Button className="mt-6 px-4 py-4 text-lg">
          <Link to="/signup">Get Started!</Link>
        </Button>
      </div>

      <div className="w-full h-96 md:h-screen mt-8">
        <img
          src={foodSharing}
          alt="Food Sharing"
          className="h-full w-full object-fill"
        />
      </div>
    </div>
  );
}
