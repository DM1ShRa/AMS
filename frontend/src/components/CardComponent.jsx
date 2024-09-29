import React, { useState } from "react";
import ModalComponent from "./modal";
import SensorDetailsWithSWR from "./sensorDetails";

const CardComponent = ({
  imageUrl,
  title,
  description,
  authorName,
  authorImage,
  date,
  sensorId,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="py-20 max-w-sm w-full lg:max-w-full lg:flex">
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        title={title}
      ></div>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-black-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            {/* Some icon */}
          </p>
          <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div class="px-1 pb-4 pt-0 mt-2">
          <button
            class="rounded-md bg-slate-800 py-2 px-4 text-white"
            onClick={handleOpenModal}
          >
            View Live Data
          </button>
        </div>
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={authorImage}
            alt={`Avatar of ${authorName}`}
          />
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{authorName}</p>
            <p className="text-gray-600">{date}</p>
          </div>
        </div>
      </div>

      <ModalComponent show={showModal} handleClose={handleCloseModal}>
        <SensorDetailsWithSWR sensorId={sensorId} />
      </ModalComponent>
    </div>
  );
};

export default CardComponent;
