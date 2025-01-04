import { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      Swal.fire({
        title: "Thank you!",
        text: "Your message has been sent successfully!",
        icon: "success",
        confirmButtonText: "Close",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
        inquiryType: "",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill out all the fields.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Contact Us</h2>
      <p className="text-center text-lg text-gray-600 mb-8">
        Need help or have any questions? Reach out to our team directly via the
        contact form below, or find more details on how to reach us.
      </p>
      <div className="w-full border-b-8 rounded-full border-amber-600 mx-auto mb-10"></div>

      {/* Call Us Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Call Us</h3>
        <p className="text-gray-600 mb-4">
          For Domestic Reservations or Local Reservations, use the following
          number:
        </p>
        <p className="text-gray-700 font-semibold">Phone Number: 12 34 56</p>
        <p className="text-gray-600 mb-4">
          Hours of Operation: Mon-Sun: 08:00-20:00
        </p>
        <p className="text-gray-600 mb-4">Additional Service Numbers:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Gold Plus Rewards: 1234 567 890</li>
          <li>Wheelchair Accessible Vehicles: 1234 567 890</li>
          <li>
            Claims Management (Email for Damage claims only): whatever@email.com
          </li>
          <li>Customer Relations (For Past Rentals Only): 1234 567 890</li>
        </ul>
      </div>
      <div className="w-full border-b-8 rounded-full border-amber-600 mx-auto mb-10"></div>

      <div className="mb-8 text-center text-2xl font-semibold text-gray-700">
        <p>For other inquiries, submit this form:</p>
      </div>
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="text-lg font-medium text-gray-700"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows="6"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-700 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default Contact;
