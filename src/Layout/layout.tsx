import React, { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Session } from "../Utils/session";

import UP from "../assets/images/logos/UPLB_VIGHRColor_1.png";
import CEM from "../assets/images/logos/CEM.png";
import UPLB from "../assets/logo.png";
import Footer from "./footer";
import LogoBanner from "./Header/logoBanner";
import Header from "./Header/header";

import { FaChevronUp } from "react-icons/fa";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  const isAdmin = Session.get.isAdmin();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-y-scroll");

    const handleScroll = () => {
      if (scrollContainer && scrollContainer.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".overflow-y-scroll");
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-y-scroll");
    scrollContainer?.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-boxdark-2 dark:text-bodydark">
      {/* Sidebar logic here */}
      <div className="relative flex flex-col flex-1 min-h-screen bg-white overflow-x-hidden overflow-y-scroll">
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-primary text-white shadow-xl hover:bg-secondary"
            title="Scroll to Top"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaChevronUp />
          </motion.button>
        )}

        {/* {!isAdmin && isIndexPage && <LogoBanner />}
        {!isAdmin && <StickyHeader />}
        {isAdmin && <AdminHeader />} */}

        {!isAdmin && isIndexPage && (<div className="hidden md:block"> <LogoBanner /></div> )}
        {!isAdmin && (<div className="sticky top-0 z-[9999]">  <Header /> </div> )}
        {!isAdmin && isIndexPage && ( <div className="md:hidden"> <LogoBanner /> </div> )}

        <main className="bg-white">
          <div className="mx-auto max-w-full">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
