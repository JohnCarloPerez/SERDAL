import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "./Layout/layout";
import PageMeta from "./Components/pageMeta";
import Home from "./Pages/home";
import AboutUs from "./Pages/aboutUs";
import People from "./Pages/people";
import Services from "./Pages/services";
import Events_InfoPage from "./Pages/Events_Highlights/events_InfoPage";
import Events_Highlights from "./Pages/Events_Highlights/eventsHighlights";
import ContactUs from "./Pages/contactUs";
import ToolBox from "./Pages/toolbox";
import SignIn from "./Pages/Login/signIn";
import SignUp from "./Pages/Login/signUp";
import ResetPassword from "./Pages/Login/resetPassword";
import { Session } from "./Utils/session";
import Dashboard from "./Pages/Admin/dashboard";
import MaintenancePage from "./Components/MaintenancePage";
import NotFound from "./Pages/NotFound";
import CustomFilterDemo from "./Pages/TEST/publication";

const App: React.FC = () => {
  useEffect(() => {
    Session.set.isLoggedIn(false);
    Session.set.isAdmin(false);
  }, []);

  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>
        {Session.get.isAdmin() && Session.get.isLoggedIn() ? (
          <Route index element={<><PageMeta title="Dashboard" /><Dashboard /></>} />
        ) : (
          <>
            <Route index element={<><PageMeta title="Home" /><Home /></>} />
            <Route path="/AboutUs" element={<><PageMeta title="About Us" /><AboutUs /></>} />
            <Route path="/People" element={<><PageMeta title="People" /><People /></>} />
            {/* <Route path="/Publication" element={<><PageMeta title="People" /><CustomFilterDemo /></>} /> */}
            <Route path="/Publication" element={<><PageMeta title="People" /><CustomFilterDemo /></>} />
            <Route path="/Services" element={<><PageMeta title="Services" /><Services /></>} />
            <Route path="/Toolbox" element={<><PageMeta title="Toolbox" /><ToolBox /></>} />
            <Route path="/EventsAndHighlights" element={<><PageMeta title="Events and Highlights" /><Events_Highlights /></>} />
            <Route path="/EventsAndHighlights/Info/:infopage" element={<><PageMeta title="Event Info" /><Events_InfoPage /></>} />
            <Route path="/ContactUs" element={<><PageMeta title="Contact Us" /><ContactUs /></>} />
            <Route path="/Auth/SignIn" element={<><PageMeta title="SignIn" /><SignIn /></>} />
            <Route path="/Auth/SignUp" element={<><PageMeta title="SignUp" /><SignUp /></>} />
            <Route path="/Auth/ResetPassword" element={<><PageMeta title="ResetPassword" /><ResetPassword /></>} />
          </>
        )}
      </Route>

      <Route  path="*"  element={<NotFound/>} />
    </Routes>
  );
};

export default App;
