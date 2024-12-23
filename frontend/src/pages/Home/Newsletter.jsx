import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/13781/pexels-photo-13781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
      }}
    >
      <div className="max-w-7xl mx-auto text-center bg-gray-500 bg-opacity-50 p-10">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Stay Updated with Our Newsletter
        </h2>
        <p className="text-lg text-white mb-8">
          Sign up to receive the latest news and updates directly in your inbox.
        </p>

        {/* Newsletter Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-80"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-green-600">
            Thank you for subscribing! We’ll keep you updated.
          </p>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
