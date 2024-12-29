import SearchAvailability from "../../components/SearchAvailability";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-900 h-screen">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/24821/pexels-photo-24821.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold my-6">Rent a Car</h1>
        <p className="text-lg md:text-xl mb-6">
          Find the best car rental deals for your next trip.
        </p>
        <SearchAvailability />
      </div>
    </div>
  );
};

export default HeroSection;
