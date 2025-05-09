import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import LoginDisplay from "../../Components/LoginDisplay";

interface UserForm {
  Id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repassword: string;
  university: number;
}

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: number;
  role: string;
  img: string;
  createDateTime: string; // You can adjust the type if needed (e.g., Date)
  university: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  Password: string;
  IsActive: number;
  role: string;
  img: string;
  createDateTime: string;
  modifiedDateTime: string;
  ModifiedBy: number;
  university: number;
}

interface userOTP {
  otp: string;
  userEmail: string;
  password: string;
  repassword: string;
}

const ResetPassword: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState<boolean>(false);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [ismatchpass, setIsmatchpass] = useState<boolean>(true);
  const [ErrorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState<userOTP>({
    otp: "",
    userEmail: "",
    password: "",
    repassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsmatchpass(true);
    //setIsSubmitting(false);
    if (isSubmitting) {
      console.log("disabled", isSubmitting);
      return;
    }

    if (formData.password.toLowerCase() != formData.repassword.toLowerCase()) {
      setErrorMessage("Password not match");
      setIsmatchpass(false);
      return;
    }

    const resetidotp = localStorage.getItem("otp");
    const useremail = localStorage.getItem("userEmail");
    console.log(resetidotp);
    console.log(useremail);

    //setIsSubmitting(true);

    const encodedEmail = encodeURIComponent(formData.userEmail);

    try {
      const swalLoading = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        icon: "",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        backdrop: `rgba(0,0,0,0.4) url("https://loading.io/spinners/comets/index.svg?color=%2317C0CC") left top no-repeat`,
        customClass: {
          popup: "swal-popup",
        },
        showConfirmButton: false,
      });

      const response = await fetch(
        `${apiUrl}/api/Users/ResetPasswordOTP/${encodedEmail}`
      );

      const responseData = await response.json();

      if (response.ok) {
        swalLoading.close();
        //setIsSubmitting(false);
        setOTP(responseData);
        OTPVerify(responseData);
      } else {
        swalLoading.close();
        return Swal.fire({
          icon: "error",
          title: "Reset password failed",
          text: responseData.message || "Unexpected Error",
          confirmButtonColor: "#2591DE",
        });
      }
    } catch (error) {
      swalLoading.close();
      console.error("Error submitting OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong while creating OTP. Please try again.",
        confirmButtonColor: "#2591DE",
      });
    } finally {
      swalLoading.close();
      //setIsSubmitting(false);
    }
  };

  const OTPVerify = (otp: string) => {
    Swal.fire({
      title: "Enter your OTP",
      text: `To complete your password reset request, an OTP will be sent to ${formData.userEmail}. Please check our email at your inbox, spam folder or junk mail`, // The additional message
      input: "text",
      confirmButtonColor: "#2591DE",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Verify OTP",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "swal-button-verify", // Apply custom class to the confirm button
        input: "swal-input-verify", // Apply custom class to the input field
      },
      preConfirm: async (inputOTP) => {
        const normalizedOtp = otp ? String(otp).trim() : "";
        const normalizedInputOTP = String(inputOTP).trim();

        if (normalizedOtp === normalizedInputOTP) {
          try {
            const data = {
              email: formData.userEmail,
              password: formData.password,
            };

            const response = await fetch(`${apiUrl}/api/Users/ResetPassword`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorResponse = await response.json();
              if (response.status === 400) {
                // Handle BadRequest (User already exists)
                return Swal.fire({
                  icon: "error",
                  title: "Registration Failed",
                  text: errorResponse.message || "Unexpected Error",
                  confirmButtonColor: "#2591DE",
                });
              }
            }

            const responseData: UserInfo = await response.json();
            console.log(responseData);
            // Show success message for 2 seconds
            Swal.fire({
              icon: "success",
              title: "Reset Password Successful!",
              text: "Your password has been successfully reset.",
              timer: 3000, // Auto-close after 2 seconds
              showConfirmButton: false, // Hide the confirm button
            }).then(() => {
              navigate("/auth/signin");
            });
          } catch (error) {
            return Swal.showValidationMessage(`Request failed: ${error}`);
          }
        } else {
          // Invalid OTP
          const inputElement = Swal.getInput(); // Get the input element
          if (inputElement) {
            inputElement.style.borderColor = "red"; // Change border to red
          }
          // Show validation message
          return Swal.showValidationMessage("Invalid OTP! Please try again.");
        }
      },
      allowOutsideClick: false,
      didClose: () => {
        // Reset the input border color when the modal is closed
        const inputElement = Swal.getInput();
        if (inputElement) {
          inputElement.style.borderColor = ""; // Reset the border color
        }
      },
      timer: 30 * 60 * 1000,
    });

    // Add the custom CSS to style the verify button and input field
    const style = document.createElement("style");
    style.innerHTML = `
    .swal-button-verify {
      background-color: #2591DE !important;
      border-color: #2591DE !important;
      color: white !important;
    }
    .swal-button-verify:hover {
      background-color: #149fa3 !important;
      border-color: #149fa3 !important;
    }
    
    .swal-input-verify {
      border-color: #2591DE !important;
      box-shadow: none !important;
      text-align: center; /* Center the text */
    }

    .swal-input-verify:focus {
      border-color: #2591DE !important;
      outline: none;
      box-shadow: 0 0 3px rgba(23, 192, 204, 0.5) !important;
    }
  `;
    document.head.appendChild(style);
  };

  return (
    <>
      {/* <Breadcrumb pageName="Sign Up" /> */}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap">
          <div className="hidden w-full xl:block xl:w-1/2">
                <LoginDisplay />
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Reset Password
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="userEmail"
                      name="userEmail"
                      onChange={handleInputChange}
                      value={formData.userEmail}
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Re-type Password
                  </label>
                  <div className="relative">
                    <input
                      id="repassword"
                      name="repassword"
                      onChange={handleInputChange}
                      value={formData.repassword}
                      type="password"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className={`w-full rounded-lg border bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:text-white dark:focus:border-primary ${
                        ismatchpass ? "border-stroke" : "border-red-500"
                      }`}
                      required
                    />

                    <span className="absolute right-4 top-2">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                {ErrorMessage && (
                  <div className="text-red text-xs mb-3 ml-3 mt-3">
                    {ErrorMessage}
                  </div>
                )}

                <div className="mb-5">
                  <input
                    // disabled={isSubmitting}
                    type="submit"
                    value="Reset Password"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Already have an account?{" "}
                    <Link
                      to="/Auth/SignIn"
                    //   onClick={(e) => {
                    //     e.preventDefault();
                    //     window.location.href = `/auth/signin`;
                    //   }}
                      className="text-primary"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
    paddingLeft: "10px",
    borderWidth: "2px",
    borderColor: "6B7280", // Keep the border color consistent
    boxShadow: state.isFocused ? "0 0 0 0px #2591DE" : "none", // Remove default blue focus outline
    "&:hover": {
      borderColor: "6B7280", // Ensure hover border stays the same
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.7rem",
    backgroundColor: state.isSelected ? "#2591DE" : "transparent",
    color: state.isSelected ? "#fff" : "#000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#2591DE", // Keep hover effect consistent
      color: "#fff",
    },
  }),
};

export default ResetPassword;
