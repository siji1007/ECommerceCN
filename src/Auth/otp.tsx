import React, { useState, useEffect } from 'react';

import host from '../host/host.txt?raw'


const OtpModal: React.FC<{ 
    onClose: () => void, 
    onVerifyOtp: (otp: string) => void, 
    generatedOtp: string, 
    senderEmail: string // Add senderEmail prop
  }> = ({ onClose, onVerifyOtp, generatedOtp, senderEmail }) => {
    const [otp, setOtp] = useState<string>(''); // Store OTP code entered by the user

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; 
    const otpArray = otp.split('');
    otpArray[index] = value;
    setOtp(otpArray.join(''));
  };
  

  // Move to the next input field after entering a value
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        // Move focus to the previous input field if backspace is pressed
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (e.key !== 'Backspace' && otp[index] !== '') {
      // Move to next input field after a value is entered
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length === 4) {
      try {
        // Send OTP to the backend for verification
        const response = await fetch(host+'/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }),
        });

        if (response.ok) {
          // OTP is verified successfully
          console.log(`OTP ${otp} verified successfully!`);

          // Proceed with the sign-up after OTP verification
          onVerifyOtp(otp);  // Use the prop function to handle OTP verification
        } else {
          // OTP is invalid
          console.log(`Invalid OTP: ${otp}. Please try again.`);
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        console.log('Failed to verify OTP');
      }
    } else {
      console.log('Please enter a 4-digit OTP');
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-xl font-bold mb-4">Enter OTP</h2>
        <p className="text-center text-sm mb-4">OTP sent to: {senderEmail}</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-4">
            {/* 4 individual OTP input boxes */}
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={otp[index] || ''}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyUp={(e) => handleKeyUp(e, index)}
                maxLength={1}
                className="w-16 h-16 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="-"
              />
            ))}
          </div>
          <p>We are confirming your active Gmail account by sending a verification code to it.</p>
          <div className="mt-4 text-center">
            <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded-md">
              Verify OTP
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
