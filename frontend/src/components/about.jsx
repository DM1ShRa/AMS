import React from "react";
import { FaStar, FaAward, FaUsers, FaHeartbeat, FaLightbulb, FaHandsHelping } from "react-icons/fa";

const About = () => {
  return (
    <div className=" text-gray-800 py-12">
      {/* Hero Section */}
      <section className="text-center px-4 md:px-16 lg:px-32 mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Get a Chance to Know About Us and <span className="text-slate-400">Relive Our Journey</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Meet our dynamic team and discover the roadmap to success as we let you know how we work.
        </p>
        <button className="px-6 py-3 bg-slate-600 text-white rounded-full hover:bg-slate-900 transition duration-300">
          Let's Talk
        </button>
      </section>

      {/* Statistics Section
      <section className="py-12 px-4 md:px-16 lg:px-32 flex flex-wrap justify-around items-center bg-gray-50 rounded-lg shadow-md mb-16">
        <div className="text-center mb-8 hover:scale-105 transition transform duration-300">
          <h2 className="text-3xl font-bold">1k+</h2>
          <p className="text-gray-600">Customers</p>
        </div>
        <div className="text-center mb-8 hover:scale-105 transition transform duration-300">
          <FaAward className="text-5xl text-indigo-600 mx-auto mb-2" />
          <p className="text-gray-600">Global Leader 2023</p>
        </div>
        <div className="text-center mb-8 hover:scale-105 transition transform duration-300">
          <h2 className="text-3xl font-bold">4.9</h2>
          <FaStar className="text-yellow-500 inline" />
          <FaStar className="text-yellow-500 inline" />
          <FaStar className="text-yellow-500 inline" />
          <FaStar className="text-yellow-500 inline" />
          <FaStar className="text-yellow-500 inline" />
          <p className="text-gray-600">Clutch</p>
        </div>
      </section> */}

      {/* Values Section */}
      <section className="py-12 px-4 md:px-16 lg:px-32">
        <h3 className="text-2xl font-bold mb-6 text-center">About Our Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Value Card */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <FaLightbulb className="text-4xl text-slate-900 mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Integrity</h4>
            <p className="text-gray-600">
              Honesty is our guiding principle, ensuring that we meet and exceed our expectations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <FaHeartbeat className="text-4xl text-slate-900 mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Passion</h4>
            <p className="text-gray-600">
              Passion fuels our relentless habit of excellence, continuous growth, and on-time delivery.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <FaHandsHelping className="text-4xl text-slate-900 mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Commitment</h4>
            <p className="text-gray-600">
              Our commitment to our work and clients forms an unbreakable bond.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section
      <section className="py-12 px-4 md:px-16 lg:px-32 text-center">
        <h3 className="text-2xl font-bold mb-6">Our Journey</h3>
        <p className="text-lg text-gray-600 mb-8">
          Come join us in our journey to growth and betterment.
        </p>
        <div className="flex justify-center items-center overflow-x-auto">
          <div className="flex space-x-8">
            <div className="text-center">
              <h4 className="text-xl font-bold">2016</h4>
              <p className="text-gray-600">Founded</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold">2018</h4>
              <p className="text-gray-600">Expansion</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold">2020</h4>
              <p className="text-gray-600">Innovation</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold">2023</h4>
              <p className="text-gray-600">Global Recognition</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="py-12 px-4 md:px-16 lg:px-32">
        <h3 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <img
              src="./abhishek.jpeg"
              alt="John Doe"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <h4 className="text-xl font-semibold">Abhishek Jadhav</h4>
            <p className="text-gray-600">Project Lead</p>
            <p className="text-gray-500 text-sm">2021.abhishek.jadhav@ves.ac.in</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <img
              src="./mishra.jpeg"
              alt="Jane Smith"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <h4 className="text-xl font-semibold">Darash Mishra</h4>
            <p className="text-gray-600">Software Developer</p>
            <p className="text-gray-500 text-sm">2021.darash.mishra@ves.ac.in</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <img
              src="./aaqi.jpeg"
              alt="Alan Brown"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <h4 className="text-xl font-semibold">Aaqueeb Pinjari</h4>
            <p className="text-gray-600">IOT Lead</p>
            <p className="text-gray-500 text-sm">2021.aaqueeb.pinjari@ves.ac.in</p>
          </div>
        </div>
      </section>

      {/* Advisors Section
      <section className="py-12 px-4 md:px-16 lg:px-32">
        <h3 className="text-2xl font-bold mb-6 text-center">Advisors and Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <img
              src="https://via.placeholder.com/150"
              alt="Prof. Emily White"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <h4 className="text-xl font-semibold">Prof. Emily White</h4>
            <p className="text-gray-600">Advisor</p>
            <p className="text-gray-500 text-sm">emily.white@university.com</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
            <img
              src="https://via.placeholder.com/150"
              alt="Dr. Mark Davis"
              className="rounded-full w-24 h-24 mx-auto mb-4"
            />
            <h4 className="text-xl font-semibold">Dr. Mark Davis</h4>
            <p className="text-gray-600">Senior Mentor</p>
            <p className="text-gray-500 text-sm">mark.davis@researchlab.com</p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;
