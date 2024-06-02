import React from "react";
import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/assets/logo_pic1.png";

const SideBar = React.lazy(() => import("../Components/SideBar"));
const UserProfile = React.lazy(() => import("../Components/UserProfile"));
const Pins = React.lazy(() => import("./Pins"));

function Home({ user }) {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const scrollRef = useRef(null);

  const sideBarFunction = () => {
    setToggleSidebar((prevstate) => !prevstate);
  };

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex bg-black md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className=" left-0 hidden md:flex h-screen flex-initial">
        <AnimatePresence mode="wait">
          {toggleSidebar && (
            <motion.div
              className="fixed w-[200px] bg-white h-screen overflow-y-auto shadow-md z-[21] overflow-x-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <div className="absolute w-full flex justify-end items-center p-2"></div>
              <SideBar closeToggle={setToggleSidebar} user={user && user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {toggleSidebar && (
        <div
          className="fixed md:hidden inset-0 bg-black opacity-50 z-[10]"
          onClick={() => setToggleSidebar(false)} // Close the sidebar on click
        />
      )}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={20}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-20" />
          </Link>
          <Link to={`user-profile/${user?.uid}`}>
            <img
              src={user?.photoURL}
              alt="user-pic"
              className="w-9 h-9 rounded-full "
            />
          </Link>
        </div>
        <AnimatePresence mode="wait">
          {toggleSidebar && (
            <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 ">
              <div className="absolute w-full flex justify-end items-center p-2">
                <AiFillCloseCircle
                  fontSize={30}
                  className="cursor-pointer"
                  onClick={() => setToggleSidebar(false)}
                />
              </div>
              <SideBar closeToggle={setToggleSidebar} user={user && user} />
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={
              <UserProfile
                sideBarFunction={sideBarFunction}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="*"
            element={
              <motion.div
                initial={{ marginLeft: 0 }}
                animate={{ marginLeft: toggleSidebar ? 200 : 0 }}
                transition={{ duration: 0.9 }}
              >
                <Pins
                  user={user && user}
                  sideBarFunction={sideBarFunction}
                  toggleSidebar={toggleSidebar}
                />
              </motion.div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
