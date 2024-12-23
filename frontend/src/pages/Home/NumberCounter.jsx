import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

const NumberCounter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div
      className="flex items-center justify-center py-16 px-6 flex-col lg:flex-row lg:space-x-8"
      ref={ref}
    >
      {/* Total Clients */}
      <div className="text-center px-10 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Total Clients
        </h2>
        {inView && (
          <p className="text-4xl font-bold text-amber-500">
            <CountUp start={0} end={2897} duration={4.5} />
          </p>
        )}
      </div>

      {/* Vertical separator for large screens only */}
      <div className="text-6xl mx-6 text-amber-500 hidden lg:block">|</div>

      {/* Total Cars */}
      <div className="text-center px-10 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Total Cars
        </h2>
        {inView && (
          <p className="text-4xl font-bold text-amber-500">
            <CountUp start={0} end={194} duration={4.5} />
          </p>
        )}
      </div>

      {/* Vertical separator for large screens only */}
      <div className="text-6xl mx-6 text-amber-500 hidden lg:block">|</div>

      {/* Total Stores */}
      <div className="text-center px-10 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Total Stores
        </h2>
        {inView && (
          <p className="text-4xl font-bold text-amber-500">
            <CountUp start={0} end={76} duration={4.5} />
          </p>
        )}
      </div>
    </div>
  );
};

export default NumberCounter;
