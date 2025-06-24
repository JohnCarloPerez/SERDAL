import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ClickOutside from "../../Utils/ClickOutside";
import UserOne from "../../../images/user/user-01.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCaretDown,  faGear, faLeftLong, faUpload, faUser, } from "@fortawesome/free-solid-svg-icons";
import {Session} from "../../Utils/session";

const DropdownHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    Session.clearAll();
    navigate("/");
    window.location.reload();
  };

  const firstname = localStorage.getItem("firstname");
  const lastName = localStorage.getItem("lastname");
  const img = localStorage.getItem("img");

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link onClick={() => setDropdownOpen(!dropdownOpen)}  className="flex items-center lg:gap-4" to="#" >

        <span className="h-9 w-9 rounded-full overflow-hidden">
          {img && img !== "" ? (
            <img className="h-full w-full object-cover" src={img} alt="User" />
          ) : (
            <div className="bg-secondary h-full w-full flex items-center justify-center text-white text-lg lg:text-xs">
              {firstname?.charAt(0).toUpperCase()}
              {lastName?.charAt(0).toUpperCase()}
            </div>
          )}
        </span>

        <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
      </Link>
      {dropdownOpen && (
        <div
          className={`absolute text-black  right-0 mt-4 flex w-62.5 flex-col rounded-sm border bg-white shadow-default z-[9999]`}
        >
          <ul className="flex flex-col gap-5 px-6 py-7.5 hover:bg-gray-200  hover:text-primary ">
            <li>
              <Link
                to="/UploadPublication"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3.5 text-lg lg:text-sm font-medium"
              >
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                Upload Publication
              </Link>
            </li>
          </ul>
          <button onClick={logout} className="flex items-center gap-3.5 px-6 py-4 text-lg lg:text-sm font-medium  hover:text-primary h-full hover:bg-gray-200">
            <FontAwesomeIcon icon={faLeftLong}></FontAwesomeIcon>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownHeader;
