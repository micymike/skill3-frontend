import React from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

const Register = () => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.post("https://dummybackend.url/signup", data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred!");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          interval={3000}
          transitionTime={500}
        >
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?office"
              alt="Slide 1"
              className="h-screen object-cover"
            />
          </div>
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?business"
              alt="Slide 2"
              className="h-screen object-cover"
            />
          </div>
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?corporate"
              alt="Slide 3"
              className="h-screen object-cover"
            />
          </div>
        </Carousel>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-6">Let&apos;s get started</h1>

          {/* Social Login Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 bg-white hover:bg-blue-700 py-2 rounded flex items-center justify-center transition">
              <i className="fab fa-linkedin text-white mr-2"></i> LinkedIn
            </button>
            <button className="flex-1 bg-white hover:bg-red-700 py-2 rounded flex items-center justify-center transition">
              <i className="fab fa-google text-white mr-2"></i> Google
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-bold transition"
            >
              Sign up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
