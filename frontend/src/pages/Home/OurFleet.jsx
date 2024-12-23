import { Carousel } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const OurFleet = () => {
  return (
    <div className="text-center mt-5">
      <h1 className="font-semibold text-5xl mb-10">View our fleet</h1>
      <p className="text-lg w-3/4 mx-auto text-gray-800 mb-10">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi nam,
        doloremque necessitatibus sit debitis aperiam. Natus veritatis incidunt
        blanditiis!
      </p>
      <div className="w-[250px] border-b-8 rounded-full border-amber-600 mx-auto mb-10"></div>
      <Carousel
        className="rounded-xl mb-5"
        loop={true}
        prevArrow={({ handlePrev }) => (
          <button
            onClick={handlePrev}
            className="absolute top-2/4 left-4 z-50 -translate-y-2/4 text-amber-500 text-8xl"
          >
            &#8249;
          </button>
        )}
        nextArrow={({ handleNext }) => (
          <button
            onClick={handleNext}
            className="absolute top-2/4 right-4 z-50 -translate-y-2/4  text-amber-500 text-8xl"
          >
            &#8250;
          </button>
        )}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                  activeIndex === i ? "w-8 bg-amber-500" : "w-4 bg-gray-500/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {/* Slide 1 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_Car.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">Cars</p>
            <p className="text-gray-700 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        {/* Slide 2 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_4x4.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">SUV's</p>
            <p className="text-gray-700 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        {/* Slide 3 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_EV_AU.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">Electric Vehicles</p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        {/* Slide 4 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_People_Mover_AU.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">People Movers</p>
            <p className="text-gray-700 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        {/* Slide 5 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_Luxury_AU.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">Luxury cars</p>
            <p className="text-gray-700 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        {/* Slide 6 */}
        <div className="flex flex-col md:flex-row items-center justify-center h-96 gap-4 px-8">
          <img
            src="https://images.hertz.com/vehicles/Fleet_Van_AU.png"
            alt="image 1"
            className="h-84 w-84 object-contain"
          />
          <div className="text-center space-y-4">
            <p className="font-semibold text-3xl">
              Trucks,Vans,Buses and 4WD's
            </p>
            <p className="text-gray-700 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </Carousel>
      <Link to="/vehicles" className="text-blue-500">
        View All Vehicles
      </Link>
    </div>
  );
};

export default OurFleet;
