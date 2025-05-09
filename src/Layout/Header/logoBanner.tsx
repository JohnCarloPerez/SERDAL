import { Link } from "react-router-dom";

import UP from "../../assets/images/logos/UPLB_VIGHRColor_1.png";
import CEM from "../../assets/images/logos/CEM.png";
import UPLB from "../../assets/logo.png";

const LogoBanner: React.FC = () => {
  return (
    <>
      <div className="bg-bg1">
        <div className="w-full bg-black-2">
          <div className="hidden md:flex items-center justify-between md:py-3">
            <div className="px-3">
              <Link to="https://uplb.edu.ph/" target="_">
                <img
                  src={UP}
                  alt="UPLB Logo"
                  className=" max-w-[200px] max-h-15 w-auto h-auto"
                />
              </Link>
            </div>
            <div className="flex md:mr-3">
              <div>
                <Link to="https://cem.uplb.edu.ph/" target="_">
                  <img
                    src={CEM}
                    alt="CEM Logo"
                    className="md:ml-3 max-w-[200px] max-h-15 w-auto h-auto"
                  />
                </Link>
              </div>
              <div>
                <Link to="/">
                  <img
                    src={UPLB}
                    alt="SERDAL Logo"
                    className="md:ml-3 max-w-[200px] max-h-15 w-auto h-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="font-optima text-3xl md:text-[50px] font-bold text-center py-10 md:py-15 text-white bg-primary">
            Socio-Economics Research and Data Analytics Laboratory
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoBanner;
