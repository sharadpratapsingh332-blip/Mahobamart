import offerbanner from "../assets/offerbanner.png";

const OfferBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-4">
      <div
        className="rounded-3xl overflow-hidden relative h-30 bg-cover bg-center"
        style={{
           backgroundImage: `url(${offerbanner})`,
         }}
      >
        {/* Overlay */}
        <div className="absolute "></div>

        <div className="relative z-10 h-full flex items-center justify-between px-10">

          {/* <div>
            <h2 className="text-white text-4xl font-bold">
              Special Offers
            </h2>

            <p className="text-green-100 mt-2 text-lg">
              Delicious food, great savings!
            </p>
          </div> */}

          <div className="flex items-center gap-6">

            <button className="bg-green-700 hover:bg-green-900 text-white px-6 py-3 ml-97 rounded-full font-semibold">
              View Offers →
            </button>

            {/* <div className="bg-yellow-400 text-black rounded-full w-28 h-28 flex flex-col justify-center items-center font-bold">
              <span className="text-sm">UP TO</span>
              <span className="text-4xl">50%</span>
              <span>OFF</span>
            </div> */}

          </div>

        </div>
      </div>
    </section>
  );
};

export default OfferBanner;