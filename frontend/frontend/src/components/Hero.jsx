
import { MapPin } from "lucide-react";
import mahobafort from "../assets/mahoba-fort.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFindFood = async () => {
    if (loading) return;

    setLoading(true);

    try {
      let latitude;
      let longitude;

      // User entered a location
      if (location.trim()) {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: location,
              format: "json",
              limit: 1,
            },
          }
        );

        if (!res.data.length) {
          alert("Location not found. Please enter a valid location.");
          return;
        }

        latitude = res.data[0].lat;
        longitude = res.data[0].lon;
      } else {
        // Use current location if input is empty
        if (!navigator.geolocation) {
          alert("Your browser does not support location access.");
          return;
        }

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      navigate(`/products?lat=${latitude}&lng=${longitude}`);
    } catch (error) {
      console.log(error);

      alert(
        "Unable to get location. Please enter a valid location or allow location access."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        relative isolate min-h-[480px] overflow-hidden
        bg-cover bg-center
        sm:min-h-[440px]
        lg:min-h-[460px]
      "
      style={{
        backgroundImage: `url(${mahobafort})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Welcome Text */}
        <p className="text-sm font-semibold tracking-wide text-green-400 sm:text-lg">
          Welcome To Mahoba Mart
        </p>

        {/* Main Heading */}
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:mt-4 sm:text-4xl lg:text-4xl">
          Mahoba's <span className="text-green-400">Local</span>
          <br />
          <span className="text-green-400">
            Delivery Platform
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-xl text-sm leading-6 text-white sm:text-lg sm:leading-7 lg:text-lg">
          • Food • Grocery • Medicine • More at your door
        </p>

        {/* Location Search */}
        <div
          className="
            mt-6 flex w-full max-w-2xl flex-col gap-2
            rounded-xl bg-white p-2 shadow-xl
            sm:mt-8 sm:flex-row sm:items-center sm:gap-0
            sm:overflow-hidden sm:rounded-2xl sm:p-0
          "
        >
          <div className="flex min-w-0 flex-1 items-center px-2 sm:px-4">
            <MapPin
              className="shrink-0 text-green-600"
              size={22}
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFindFood();
              }}
              placeholder="Enter delivery location..."
              aria-label="Delivery location"
              className="
                min-w-0 w-full bg-transparent px-3 py-3
                text-sm text-gray-800 outline-none
                placeholder:text-gray-400
                sm:px-4 sm:py-4 sm:text-base
              "
            />
          </div>

          <button
            type="button"
            onClick={handleFindFood}
            disabled={loading}
            className="
              w-full rounded-lg bg-green-700 px-5 py-3
              font-semibold text-white transition
              hover:bg-green-800
              disabled:cursor-not-allowed disabled:opacity-60
              sm:w-auto sm:self-stretch sm:rounded-none sm:px-8
            "
          >
            {loading ? "Finding..." : "Find Food"}
          </button>
        </div>

        {/* Proud to be Mahoba */}
        <div
          className="
            mt-6 text-right
            sm:absolute sm:right-8 sm:top-8 sm:mt-0
            lg:right-16 lg:top-10
          "
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          <h3 className="text-lg italic text-white sm:text-2xl">
            Proud to be
            <br />
            Mahoba ♡
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Hero;