import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import LoginDisplay from "../../Components/LoginDisplay";
import config from '../../AppConfig'


import { UserForm } from "../../Interfaces/IUser";
import { University } from "../../Interfaces/IUniversity";
import { User } from "../../Interfaces/IUser";

function SignUp () {

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [ismatchpass, setIsmatchpass] = useState<boolean>(true);
  const [ErrorMessage, setErrorMessage] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const navigate = useNavigate();
  const [university, setUniversity] = useState<University[]>([]);
  const [formData, setFormData] = useState<UserForm>({
    Id: 0,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repassword: "",
    university: 0,
  });



  const [selectedOption, setSelectedOption] = useState<any>(null);

  const handleChange = (selectedOption1: any) => {
    setSelectedOption(selectedOption1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      university: selectedOption1 ? selectedOption1.value : "",
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/Publication/University`, {
          method: "GET",
        });
        if (response.ok) {
          const jsonData: University[] = await response.json();
          setUniversity(jsonData);
        } else {
          const errorResponse = await response.json();
          console.error(
            "Error message",
            errorResponse.message || "Unknown error"
          );
          setErrorMessage(errorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching publication data:", error);
        setErrorMessage("Error fetching publication data");
      } finally {
      }
    };

    fetchData();
  }, []);

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

    if (formData.password.toLowerCase() != formData.repassword.toLowerCase()) {
      setErrorMessage("Password not match");
      setIsmatchpass(false);
      return;
    }

    if (!isChecked) {
      setErrorMessage(
        "You must accept the terms and conditions before registering."
      );
      return;
    }

    const swalLoading = Swal.fire({
      title: "Please wait...",
      text: "Registration in progress",
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

    const data = {
      ID: 0,
      FirstName: formData.firstname,
      LastName: formData.lastname,
      Email: formData.email,
      Password: formData.password,
    };

    const otpData = {
      OTPtypeId: 1,
      Email: formData.email,
    };

    try {
      const response = await fetch(`${config.apiUrl}/api/Users/sendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });

      if (response.ok) {
        console.log("Form data submitted successfully!");
        swalLoading.close();
        const otp = await response.json();
        OTPVerify(otp);
      } else {
        swalLoading.close();
        if (response.status === 400) {
          const errorResponse = await response.json();
          return Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: errorResponse.message || "User already exists. Please login.",
            confirmButtonColor: "#2591DE",
          });
        } else {
          swalLoading.close();
          console.error("Registration Failed");
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "Something went wrong while creating your account. Please try again.",
            confirmButtonColor: "#2591DE",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      swalLoading.close();
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong while creating your account. Please try again.",
        confirmButtonColor: "#2591DE",
      });
    } finally {
      swalLoading.close();
    }
  };

  const OTPVerify = (otp: string) => {
    Swal.fire({
      title: "Enter your OTP",
      text: `To complete your registration, an OTP will be sent to ${formData.email}. Please check our email at your inbox, spam folder or junk mail`, // The additional message
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
              ID: 0,
              FirstName: formData.firstname,
              LastName: formData.lastname,
              Email: formData.email,
              Password: formData.password,
              university: selectedOption ? selectedOption.value : 0,
            };

            const response = await fetch(`${config.apiUrl}/api/Users/Create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorResponse = await response.json();
              if (response.status === 400) {
                return Swal.fire({
                  icon: "error",
                  title: "Registration Failed",
                  text:
                    errorResponse.message ||
                    "User already exists. Please login.",
                  confirmButtonColor: "#2591DE",
                });
              }
            }

            const responseData = await response.json();

            const userDetails = responseData.user;
            const Token = responseData.apiToken;

            const returnedUser: User = {
              id: userDetails.id,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              email: userDetails.email,
              IsActive: userDetails.isActive,
              role: userDetails.role,
              img: userDetails.img,
              createDateTime: userDetails.createDateTime,
              university: userDetails.university,
            };

            localStorage.setItem("id", returnedUser.id.toString());
            localStorage.setItem("firstname", returnedUser.firstName);
            localStorage.setItem("lastname", returnedUser.lastName);
            localStorage.setItem("email", returnedUser.email);
            localStorage.setItem("img", returnedUser.img);
            localStorage.setItem("role", returnedUser.role);
            localStorage.setItem(
              "university",
              returnedUser.university.toString()
            );
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("APIToken", Token.toString());

            // Show success message for 2 seconds
            Swal.fire({
              icon: "success",
              title: "Registration Successful!",
              text: "Your account has been created successfully.",
              timer: 3000, // Auto-close after 2 seconds
              showConfirmButton: false, // Hide the confirm button
            }).then(() => {
              if (userDetails.role.toLowerCase() == "admin") {
                localStorage.setItem("isAdmin", "true");
                navigate("/");
                window.location.reload();
              } else {
                localStorage.setItem("isAdmin", "false");
                navigate("/");
              }

              window.location.reload();
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

  const universityOptions = university.map((uni) => ({
    value: uni.id,
    label: uni.label,
  }));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setErrorMessage("");
  };

  return (
    <>
      {/* <Breadcrumb pageName="Sign Up" /> */}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap">
          <div className="hidden w-full xl:block xl:w-1/2">
            {<LoginDisplay />}
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up to SERDAL
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Institution
                  </label>
                  <div className="relative">
                    <Select
                      id="university"
                      placeholder="Select Institution"
                      value={selectedOption}
                      onChange={handleChange}
                      options={universityOptions}
                      styles={customStyles}
                      name="university"
                      className="!text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstname"
                      name="firstname"
                      onChange={handleInputChange}
                      value={formData.firstname}
                      type="text"
                      placeholder="Enter your first name"
                      autoComplete="given-name"
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
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastname"
                      name="lastname"
                      onChange={handleInputChange}
                      value={formData.lastname}
                      type="text"
                      placeholder="Enter your last name"
                      autoComplete="family-name"
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
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
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
                    Password
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

                <div className="my-5">
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsModalOpen(true);
                          }}
                          className="text-indigo-600 hover:underline"
                        >
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPolicyOpen(true);
                          }}
                          className="text-indigo-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
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
                    value="Create account"
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
                    //     window.location.href = `/Auth/SignIn`;
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

      {isModalOpen && (
        <div className="fixed inset-0 text-sm flex justify-center items-center z-50 bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-5">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <section>
              <p>
                By accessing or using this website provided by <b>SERDAL</b>,
                you agree to comply with and be bound by these Terms and
                Conditions. Please read these Terms carefully before
                registering, using, or accessing our Services. If you do not
                agree to these Terms, you should not use our Services.
              </p>
            </section>

            <section className="mt-3">
              <p>
                You are responsible for maintaining the confidentiality of your
                account and for all activities that occur under your account.
                You agree to use the Services only for lawful purposes.
              </p>
            </section>

            <section className="mt-3">
              <p>
                Please review our <b>Privacy Policy</b> to understand how we
                collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h5 className="text-md font-semibold mt-5">
                Contact Information
              </h5>
              <p>
                If you have any questions about these Terms, please contact us
                at:
                <br />
                Email: SERDAL@uplb.edu.ph
              </p>
            </section>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full py-2 bg-primary text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isPolicyOpen && (
        <div className="fixed inset-0 text-sm flex justify-center items-center z-50 bg-gray-600 bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-5">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <section>
              <p>
                We collect personal information when you use our website or
                services, such as your name, email address and any other details
                you provide to us.
              </p>
            </section>

            <section className="mt-3">
              <p>
                The information we collect is used to improve our services,
                provide customer support, and send you updates or promotions
                related to our offerings. We do not sell or share your personal
                information with third parties without your consent.
              </p>
            </section>

            <section className="mt-3">
              <p>
                We take appropriate measures to secure your personal
                information, including encryption and firewalls. However, please
                note that no data transmission method is completely secure.
              </p>
            </section>

            <section className="mt-3">
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the content or privacy practices of these
                sites. We encourage you to read their privacy policies before
                submitting any personal information.
              </p>
            </section>

            <section>
              <h5 className="text-md font-semibold mt-5">
                Contact Information
              </h5>
              <p>
                If you have any questions or concerns about our Privacy Policy,
                please contact us at:
                <br />
                Email: Serdal@uplb.edu.ph
              </p>
            </section>
            <button
              onClick={() => setIsPolicyOpen(false)}
              className="mt-4 w-full py-2 bg-primary text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
    fontSize: "0.9rem",
    backgroundColor: state.isSelected ? "#2591DE" : "transparent",
    color: state.isSelected ? "#fff" : "#000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#2591DE", // Keep hover effect consistent
      color: "#fff",
    },
  }),
};

export default SignUp;
