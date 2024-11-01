import React from "react";

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">{title}</h2>
        <div className="mb-4">{content}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
