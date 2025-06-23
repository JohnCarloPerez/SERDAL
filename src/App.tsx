import { useEffect, useState } from 'react'
import Layout from './Layout/layout'
import { Route, Routes } from 'react-router-dom'
import PageMeta from './Components/pageMeta'
import Home from './Pages/home'
import AboutUs from './Pages/aboutUs'
import People from './Pages/people'
import Services from './Pages/services'
import Events_InfoPage from './Pages/Events_Highlights/events_InfoPage'
import Events_Highlights from './Pages/Events_Highlights/eventsHighlights'
import ContactUs from './Pages/contactUs'
import ToolBox from './Pages/toolbox'
import SignIn from './Pages/Login/signIn'
import SignUp from './Pages/Login/signUp'
import ResetPassword from './Pages/Login/resetPassword'

import { Session} from './Utils/session'
import Dashboard from './Pages/Admin/dashboard'

const App: React.FC = () => {

  useEffect(() => {
    console.log(Session.logAll());
    Session.set.isLoggedIn(true);
    Session.set.isAdmin(true);
    //Session.clearAll();
  },[])

  return (
    <>
      <Layout>
        <Routes>
        {
          Session.get.isAdmin() && Session.get.isLoggedIn() ? (
            <Route index path="/" element={<><PageMeta title="Dashboard" /><Dashboard /></>} />
          ):(
            <>
            <Route index path="/" element={<><PageMeta title="Home" /><Home /></>} />
            <Route path="/AboutUs" element={<><PageMeta title="AboutUs" /><AboutUs /></>} />
            <Route path="/People" element={<><PageMeta title="People" /><People /></>} />
            <Route path="/Services" element={<><PageMeta title="People" /><Services /></>} />
            <Route path="/Toolbox" element={<><PageMeta title="Contact Us" /><ToolBox /></>} />
            <Route path="/EventsAndHighlights" element={<><PageMeta title="Events and Highlights" /><Events_Highlights /></>} />
            <Route path="/EventsAndHighlights/Info/:infopage" element={<> <PageMeta title="SERDAL | EventsAndHighlights Info" /> < Events_InfoPage/> </>} />
            <Route path="/ContactUs" element={<><PageMeta title="Contact Us" /><ContactUs /></>} />

            <Route path="/Auth/SignIn" element={<><PageMeta title="SignIn" /><SignIn /></>} />
            <Route path="/Auth/SignUp" element={<><PageMeta title="SignUp" /><SignUp /></>} />
            <Route path="/Auth/ResetPassword" element={<><PageMeta title="ResetPassword" /> <ResetPassword /> </>} />
            </>
            
          )
        }
        </Routes>
      </Layout>
    </>
  )
}

export default App
