import React from "react";
import { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import SensorSelectionForm from "./sensorSelectionForm";
import ContactUs from "./ContactUs";
import { db } from "../Firebase/firebaseConfig";
import { useAuth } from "@clerk/clerk-react";
import { doc, getDoc } from "firebase/firestore";

const Home = () => {
  const { userId } = useAuth();
  const [userSensors, setUserSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSensorForm, setShowSensorForm] = useState(false);
  const [noSensors, setNoSensors] = useState(false);

  const fetchUserSensors = async () => {
    if (userId) {
      try {
        setLoading(true);
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const sensors = userData?.Sensors || [];
          const noSensorsFlag = userData?.noSensors || false;

          setUserSensors(sensors);
          setNoSensors(noSensorsFlag);

          if (sensors.length === 0 && !noSensorsFlag) {
            setShowSensorForm(true);
          } else {
            setShowSensorForm(false);
          }
        } else {
          setShowSensorForm(true);
        }
      } catch (error) {
        console.error("Error fetching user sensors:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserSensors();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleNoSensorsInstalled = async () => {
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          noSensors: true,
        });
        setNoSensors(true);
        setShowSensorForm(false);
      } catch (error) {
        console.error("Error updating no sensors flag:", error);
      }
    }
  };

  const handleSensorsUpdated = (newSensors) => {
    setUserSensors(newSensors);
    setNoSensors(false);
    setShowSensorForm(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={`relative ${
          showSensorForm ? "blur-lg" : ""
        } bg-transparent dark:bg-gray-900`}
      >
        <div className="bg-transparent dark:bg-gray-900">
          {/* Hero Section */}
          <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="place-self-center mr-auto lg:col-span-7">
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">
                Accident Management System
              </h1>
              <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                From checkout to global sales tax compliance, companies around
                the world use Flowbite to simplify their payment stack.
              </p>
              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 mr-3 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Speak to Sales
              </a>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img src="./Alerts.jpg" alt="mockup" className="rounded-lg" />
            </div>
          </div>
        </div>
        {/* New Section with Image and Text */}
        <div className="py-48 px-6 mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div>
            <h2 className="mb-4 text-3xl font-extrabold leading-none dark:text-gray-900">
              We didn't reinvent the wheel
            </h2>
            <p className="mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              We are strategists, designers and developers. Innovators and
              problem solvers.
            </p>
          </div>
          {/* Image Section */}
          <div className="flex flex-col space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="grid gap-4">
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div class="grid gap-4">
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div class="grid gap-4">
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div class="grid gap-4">
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    class="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Card components with increased gap */}
        {showSensorForm ? (
          <SensorSelectionForm onSensorsUpdated={handleSensorsUpdated} />
        ) : (
          <div className="py-12 px-6 mx-auto max-w-screen-xl grid gap-12 lg:grid-cols-3">
            {/* Card 1 */}
            {userSensors && userSensors.includes("FireSensor") && (
              <CardComponent
                imageUrl="https://firetechglobal.com/wp-content/uploads/2024/04/causes-of-fire-incidents-0-1024x683-1.webp"
                title="Can coffee make you a better developer?"
                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                authorName="Jonathan Reinink"
                authorImage="https://via.placeholder.com/50"
                date="Aug 18"
              />
            )}
            {/* Card 2 */}
            {userSensors && userSensors.includes("GasSensor") && (
              <CardComponent
                imageUrl="https://taraenergy.com/wp-content/uploads/2022/12/Gas-Leaks-Image-of-Gas-Pipe-Blowing-Steam-scaled.jpeg"
                title="The secret to productivity"
                description="Voluptatibus quia, nulla! Maiores et perferendis eaque."
                authorName="Sarah Doe"
                authorImage="https://via.placeholder.com/50"
                date="Sep 25"
              />
            )}
          </div>
        )}
        ;{/* Contact Us section */}
        <div className="py-12 px-6">
          <ContactUs />
        </div>
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 mt-12">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              © 2024 RakshaNetra. All rights reserved. |
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </a>
            </p>
          </div>
        </footer>
      </div>
      {showSensorForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-40" />
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative z-50">
            <SensorSelectionForm
              onSensorsUpdated={handleSensorsUpdated}
              onNoSensorsInstalled={handleNoSensorsInstalled}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
