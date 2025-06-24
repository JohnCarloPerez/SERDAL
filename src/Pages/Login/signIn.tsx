import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoginDisplay from "../../Components/LoginDisplay";

import { User } from "../../Interfaces/IUser";
import { Session } from "../../Utils/session";
import { number } from "framer-motion";

interface UserForm {
  email: string;
  password: string;
}

function SignIn () {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [Loading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UserForm>({
    email: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      ID: 0,
      Email: formData.email,
      Password: formData.password,
    };

    try {
      const response = await fetch(`${apiUrl}/api/Users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
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

        Session.set.id(returnedUser.id);
        Session.set.firstname(returnedUser.firstName);
        Session.set.lastname(returnedUser.lastName);
        Session.set.email(returnedUser.email);
        Session.set.img(returnedUser.img);
        Session.set.role(returnedUser.role);
        Session.set.university(returnedUser.university);
        Session.set.isLoggedIn(true);
        Session.set.APIToken(Token);
        setIsLoading(false);

        if (returnedUser.role.toLowerCase() == "admin") {
          Session.set.isAdmin(true);
          navigate("/");
          window.location.reload();
        } else {
          Session.set.isAdmin(false);
          navigate("/");
        }
        
        window.location.reload();
      } else {
        setIsLoading(false);
        if (response.status === 400) {
          const errorResponse = await response.json();
          return Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorResponse.message || "Invalid email or password",
            confirmButtonColor: "#17C0CC",
          });
        } else {
          console.error("Login Failed");
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Something went wrong. Please try again.",
            confirmButtonColor: "#17C0CC",
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error Login:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#17C0CC",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {Loading && (
        <div className="absolute inset-0 flex h-full items-center justify-center bg-white z-[999] bg-opacity-30">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap">
          <div className="hidden w-full xl:block xl:w-1/2">
            {<LoginDisplay />}
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to SERDAL
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
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

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
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

                <div className="mb-6 font-bold flex justify-end">
                  <Link to="/Auth/ResetPassword" className="text-primary">
                    <button type="button">
                      Forgot Password
                    </button>
                  </Link>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Sign In
                  </button>
                </div>

                {/* <Login /> */}

                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link to="/Auth/SignUp" className="text-primary">
                      Sign Up
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

export default SignIn;
