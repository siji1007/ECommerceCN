import React from 'react';

const Modal = ({ showModal, closeModal, message, isSuccess }) => {
  if (!showModal) return null; // Do not render the modal if not visible

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg max-w-sm mx-auto z-20 flex flex-col items-center justify-center space-y-4">
        
        {/* Green circle with check icon at the top center */}
        {isSuccess && (
          <div className="flex items-center justify-center bg-green-500 rounded-full w-16 h-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        )}

        {/* Message at the bottom center */}
        <h2 className="text-center text-lg font-semibold">{message}</h2>
      </div>
    </div>
  );
};

export default Modal;
