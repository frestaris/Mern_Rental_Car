import { FaCarCrash, FaCar } from "react-icons/fa";
import { RiSteeringFill } from "react-icons/ri";

const Benefits = () => {
  return (
    <>
      <div className="text-center mt-20">
        <h1 className="font-semibold text-5xl mb-10">
          Change scenery, not standards.
        </h1>
        <p className="text-lg w-3/4 mx-auto text-gray-800 mb-10">
          Rent a car with us and discover more of Australia. Whether you crave a
          long holiday on the open road or love exploring city streets while on
          a business trip, we’re here to help. Book your car and go wherever the
          road may take you. Choose from a range of vehicles to find your
          perfect ride. Let’s go!
        </p>
      </div>
      <div className="w-[250px] border-b-8 rounded-full border-amber-600 mx-auto mb-10"></div>
      <div className="flex flex-col lg:flex-row items-center justify-center py-10 px-4 lg:px-12 mb-10">
        {/* Image Section */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center">
          <img
            src="https://pngimg.com/uploads/volkswagen/volkswagen_PNG1777.png"
            alt="Car"
          />
        </div>

        {/* Text and Icon Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="font-semibold text-4xl text-gray-800 mb-4">
            Rent a car now{" "}
            <span className="text-bg-amber-600">in your hand</span>. Try it now!
          </h1>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto lg:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
            numquam exercitationem esse est.
          </p>

          {/* Benefits List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-600 text-white rounded-full p-4 w-14 h-14 flex items-center justify-center">
                <FaCar className="text-2xl" />
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-xl text-gray-800">
                  Affordable Cars for rent
                </h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  nulla corrupti quod nam sunt reiciendis sequi facilis autem.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-600 text-white rounded-full p-4 w-14 h-14 flex items-center justify-center">
                <FaCarCrash className="text-2xl" />
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-xl text-gray-800">
                  Road-side Assistant
                </h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  nulla corrupti quod nam sunt reiciendis sequi facilis autem.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-600 text-white rounded-full p-4 w-14 h-14 flex items-center justify-center">
                <RiSteeringFill className="text-2xl" />
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-xl text-gray-800">
                  24/7 Technical Support
                </h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  nulla corrupti quod nam sunt reiciendis sequi facilis autem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Benefits;
