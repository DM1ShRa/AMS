import React from "react";

const ModalComponent = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-md shadow-lg">
        <button className="modal-close float-right" onClick={handleClose}>
          ✖
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default ModalComponent;
