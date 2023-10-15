import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useState } from "react";
import { getLocalStorage, removeLocalStorage } from "../utils/SessionHelper";
import axios from "axios"; // Import Axios

import {
  emailVerificationRequest,
  otpVerifyRequest,
} from "../ApiRequest/ApiRequest";
import {
  errorNotification,
  successNotification,
} from "../utils/NotificationHelper";
import LineLoader from "../components/ui/LineLoader";

const initialState = ["", "", "", "", "", ""];

const Otp = () => {
  const [otpDigits, setOtpDigits] = useState(initialState);

  const RegEmail = getLocalStorage("RegEmail");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const input = e.target.value.replace(/\D/g, "");
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = input;
    setOtpDigits(updatedOtp);
  };

  // verify otp code
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const OTP_code = otpDigits.join("").trim();

    if (OTP_code === "") {
      errorNotification("Please enter the OTP before verifying.");
      return;
    }

    try {
      const { status, data } = await otpVerifyRequest(RegEmail, OTP_code);

      if (status === 200) {
        successNotification("OTP Verification Successful");
        navigate("/login");
      } else {
        errorNotification("OTP Verification Failed. Please check the OTP and try again.");
      }
    } catch (error) {
      console.error(error);
      errorNotification("An error occurred while verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle the "Resend OTP" functionality if needed
  const handleResend = () => {
    // Implement the logic to resend OTP
  };

  return (
    <section
      className="bg-gray-50  flex justify-center items-center "
      style={{ height: "calc(100vh - 78px)", width: "100%" }}
    >
      <div className="w-4/5 sm:w-1/3 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="block mb-2 mt-4 text-center text-3xl font-medium text-gray-900">
          OTP
        </h2>
        <div className="w-32 mx-auto h-0.5 mb-5 mt-0 bg-orange-300"></div>
        <form>
          <div className="mb-6 px-4">
            <h2 className="block mb-2 text-xl text-center font-medium text-gray-800">
              Please Enter the one-time password to verify your account
            </h2>
            <p className="text-center">
              Your Verification code has been sent to {RegEmail}
            </p>

            <div className="flex space-x-2 mt-8">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="basic"
              size="normal"
              type="button"
              text="Verify OTP"
              onClick={handleVerify}
            />
            <Button
              variant="outline"
              size="normal"
              type="button"
              text="Resend OTP"
              onClick={handleResend}
            />
          </div>
        </form>
        {loading && <LineLoader />}
      </div>
    </section>
  );
};

export default Otp;
