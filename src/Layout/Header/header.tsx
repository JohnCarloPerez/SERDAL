import { Link, useLocation } from "react-router-dom";
//import DropdownUser from './DropdownUser';

import { useState, useEffect } from "react";
import servicesData from "../../assets/Data/Services/servicesData";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import UP from "../../assets/images/logos/UPLB_VIGHRColor_1.png";
import CEM from "../../assets/images/logos/CEM.png";
import UPLB from "../../assets/logo.png";
import { Session } from "../../Utils/session";

interface data {
  id: number;
  title: string;
  summary: string;
  img: string;
}

function Header() {
  const location = useLocation();
  const [data, setData] = useState<data[]>([]);

  const isIndexPage = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown((prev) => (prev === menu ? "" : menu));
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState); // Toggle the menu state
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      // Example: 768px is the breakpoint for "desktop"
      setMenuOpen(false); // Close the menu when the screen is large enough
    }
  };

  useEffect(() => {
    setData(servicesData);
    setIsLoggedIn(Session.get.isAdmin);
  }, []);

  let LoginButton = (
    <div>
      <Link to="/Auth/SignIn">
        <motion.button
          onClick={() => setMenuOpen(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="min-w-[100px] bg-black-2 border-2 border-primary text-primary py-3 md:py-2 px-10 md:px-5 rounded-lg hover:text-white hover:bg-gray-700 hover:border-secondary text-xl md:text-sm"
        >
          Sign in
        </motion.button>
      </Link>
    </div>
  );

  // if (isLoggedIn) {
  //   // user = <div><DropdownUser /></div>;
  // }

  return (
    <>
      <div className="w-full flex items-center justify-between md:justify-center bg-bg1 text-white px-3 md:px-0 py-5 md:py-0 z-[999]">
        <div className="hidden md:block">
          {!isAdmin && !isIndexPage && (
            <Link
              className="block flex-shrink-0 w-full"
              to="https://uplb.edu.ph/"
              target="_"
            >
              <img
                src={UP}
                alt="UPLB Logo"
                className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
              />
            </Link>
          )}
        </div>

        <div className="block md:hidden">
          <Link
            className="block flex-shrink-0 w-full"
            to="https://uplb.edu.ph/"
            target="_"
          >
            <img
              src={UP}
              alt="UPLB Logo"
              className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            onClick={toggleMenu}
            className="text-3xl cursor-pointer md:hidden"
          />
        </div>

        <div
          className={`font-optima sm:block ${
            menuOpen ? "block" : "hidden"
          }  font-medium z-50 w-full md:px-2`}
        >
          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } absolute md:static top-0 left-0 w-full md:flex md:items-center md:w-auto z-50`}
          >
            {/* Full-Screen Mobile Menu */}
            <div
              className={`bg-black-2 ${
                menuOpen
                  ? "block min-h-screen w-full fixed top-0 left-0"
                  : "hidden"
              } md:hidden bg-black`}
            >
              <FontAwesomeIcon
                icon={menuOpen ? faTimes : faBars}
                onClick={toggleMenu}
                className="absolute top-4 right-4 cursor-pointer text-3xl"
              />

              <ul className="h-screen flex flex-col w-full py-20 my-15 gap-2  text-[20px] items-center z-50">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/AboutUs"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:text-primary"
                    onClick={() => toggleDropdown("People")}
                  >
                    People
                  </button>
                  {openDropdown === "People" && (
                    <ul className="ml-4 border-l border-gray-700 pl-4">
                      <li>
                        <Link
                          to="/People#phase1"
                          className="block py-1 hover:text-primary"
                          onClick={toggleMenu}
                        >
                          Phase 1
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/People#phase2"
                          className="block py-1 hover:text-primary"
                          onClick={toggleMenu}
                        >
                          Phase 2
                        </Link>
                      </li>
                      <li>
                        <a
                          href="https://cem.uplb.edu.ph/faculty-reps/"
                          target="_blank"
                          rel="noreferrer"
                          className="block py-1 hover:text-primary"
                          onClick={toggleMenu}
                        >
                          Expert Pool
                        </a>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/publication"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Publications
                  </Link>
                </li>
                <li>
                  <Link
                    to="/datasets"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Datasets
                  </Link>
                </li>

                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:text-primary"
                    onClick={() => toggleDropdown("services")}
                  >
                    Services
                  </button>
                  {openDropdown === "services" && (
                    <ul className="ml-4 border-l border-gray-700 pl-4">
                      {data.map((service) => (
                        <li
                          id={`Mservies${service.id}`}
                          key={`M${service.title}`}
                        >
                          <Link
                            to={`/Services#${service.title.replace(
                              /[\s\-]/g,
                              ""
                            )}`}
                            className="block py-1 hover:text-primary"
                            onClick={toggleMenu}
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="Toolbox"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    SERDAL Toolbox
                  </Link>
                </li>
                <li>
                  <Link
                    to="/EventsAndHighlights"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Events & Highlights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ContactUs"
                    className="block px-4 py-2 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Contact Us
                  </Link>
                </li>

                <li>
                  {!isLoggedIn ? <div>{LoginButton}</div> : <div>LoggedIn</div>}
                </li>
              </ul>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex w-full justify-center py-5 md:text-sm lg:text-lg font-bold">
              <ul className="flex md:flex-row md:items-center gap-8">
                <li className="">
                  <Link to="/" className=" hover:text-primary">
                    {" "}
                    Home{" "}
                  </Link>
                </li>
                <li className="">
                  <Link to="/AboutUs" className=" hover:text-primary">
                    {" "}
                    About Us{" "}
                  </Link>
                </li>

                <li className="relative group">
                  <Link to="/People" className=" hover:text-primary">
                    People
                  </Link>

                  {/* Dropdown menu */}
                  <ul className="absolute top-full hidden group-hover:flex flex-col bg-black border border-1 border-gray-800 p-2 rounded-md shadow-sm z-50 min-w-[160px]">
                    <li>
                      <Link
                        to="/People#phase1"
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        Phase 1
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/People#phase2"
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        Phase 2
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://cem.uplb.edu.ph/faculty-reps/"
                        target="_"
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        Expert pool
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="flex">
                  <Link to="/publication" className="hover:text-primary">
                    {" "}
                    Publications{" "}
                  </Link>
                </li>
                <li className="flex">
                  <Link to="/datasets" className="hover:text-primary">
                    {" "}
                    Datasets{" "}
                  </Link>
                </li>

                <li className="relative group">
                  <Link to="/Services" className="hover:text-primary">
                    {" "}
                    Services
                  </Link>
                  {/* Dropdown menu */}
                  <ul className="absolute top-full hidden group-hover:flex flex-col bg-black border border-1 border-gray-800 p-2 rounded-md shadow-sm z-50 min-w-[260px]">
                    {data.map((services) => (
                      <li id={`D${services.id}`} key={`D${services.title}`}>
                        <Link
                          to={`/Services#${services.title.replace(
                            /[\s\-]/g,
                            ""
                          )}`}
                          className="block px-4 py-2 hover:bg-gray-700 rounded"
                        >
                          {services.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="">
                  <Link to="Toolbox" className="hover:text-primary">
                    {" "}
                    SERDAL Toolbox{" "}
                  </Link>
                </li>

                <li className="">
                  <Link
                    to="/EventsAndHighlights"
                    className="hover:text-primary"
                  >
                    Events & Highlights
                  </Link>
                </li>

                <li className="">
                  <Link to="/ContactUs" className="hover:text-primary">
                    {" "}
                    Contact Us{" "}
                  </Link>
                </li>

                <li>
                  {!isLoggedIn ? <div>{LoginButton}</div> : <div>LoggedIn</div>}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="hidden md:block">
          {!isAdmin && !isIndexPage && (
            <div className="flex md:mr-3">
              <div>
                <Link
                  className="block flex-shrink-0"
                  to="https://cem.uplb.edu.ph/"
                  target="_"
                >
                  <img
                    src={CEM}
                    alt="CEM Logo"
                    className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
                  />
                </Link>
              </div>

              <div>
                <Link className="block flex-shrink-0" to="/">
                  <img
                    src={UPLB}
                    alt="SERDAL Logo"
                    className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="block md:hidden">
          <div className="flex md:mr-3">
            <div>
              <Link
                className="block flex-shrink-0"
                to="https://cem.uplb.edu.ph/"
                target="_"
              >
                <img
                  src={CEM}
                  alt="CEM Logo"
                  className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
                />
              </Link>
            </div>

            <div>
              <Link className="block flex-shrink-0" to="/">
                <img
                  src={UPLB}
                  alt="SERDAL Logo"
                  className="ml-1 max-h-10 md:max-w-[200px] md:max-h-15 w-auto h-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
