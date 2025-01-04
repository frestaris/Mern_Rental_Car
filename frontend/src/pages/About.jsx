import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    question: "What is this rental service?",
    answer:
      "Our rental service provides a wide range of vehicles for rent, with flexible pickup and drop-off options.",
  },
  {
    question: "How can I make a booking?",
    answer:
      "You can make a booking by selecting your desired car, entering the dates, and completing the payment process.",
  },
  {
    question: "Are there any additional fees?",
    answer:
      "We charge a small processing fee for each rental, but no hidden charges are applied.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your booking up to 24 hours before the pickup time to receive a full refund.",
  },
  {
    question: "What types of vehicles are available for rent?",
    answer:
      "We offer a wide selection of vehicles, including sedans, SUVs, trucks, and luxury cars. You can choose based on your needs and preferences.",
  },
  {
    question: "Is insurance included in the rental?",
    answer:
      "Yes, basic insurance is included in the rental. However, additional coverage options are available at an extra cost.",
  },
  {
    question: "Can I extend my rental period?",
    answer:
      "Yes, you can extend your rental period. Please contact us at least 24 hours before your return time to adjust your rental period.",
  },
  {
    question: "Do I need to pay a deposit?",
    answer:
      "Yes, a refundable deposit is required at the time of booking. The deposit will be refunded once the vehicle is returned in good condition.",
  },
];

const About = () => {
  const [open, setOpen] = useState(null);

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className=" py-8">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <img
              src="https://images.pexels.com/photos/15160474/pexels-photo-15160474/free-photo-of-aerial-view-of-car-driving-through-road-in-snowy-valley.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Hero"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 pl-8">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4">
              Rent Your Dream Car Today
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Choose from a wide range of vehicles to make your next adventure
              unforgettable. Fast, reliable, and affordable.
            </p>
            <Link
              to="/vehicles"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-700 transition"
            >
              Explore Our Fleet
            </Link>
            <p className="my-6 text-md text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam
              rerum voluptas culpa incidunt facilis minima sed, veritatis,
              commodi pariatur consequatur quibusdam! Perferendis totam quos
              voluptatibus facere sint. Debitis, quis accusamus. Itaque at
              voluptatibus deleniti adipisci illum iusto porro quos qui. Magnam
              ex itaque tempore maxime cupiditate in, recusandae, exercitationem
              harum molestias libero magni, quos assumenda aliquam culpa illum
              mollitia reiciendis? Exercitationem sint accusamus ullam maiores?
              Mollitia sequi, esse id animi vitae minus veniam ratione quibusdam
              expedita illum delectus itaque quos, sed officia. Ducimus,
              doloribus excepturi ex eaque similique labore voluptates. Aut
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200">
              <div
                className={`p-4 cursor-pointer flex justify-between items-center ${
                  open === index ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {item.question}
                </h3>
                <div
                  className={`transform transition-transform duration-500 ease-in-out ${
                    open === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <FaChevronDown className="text-gray-600" />
                </div>
              </div>
              {open === index && (
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
