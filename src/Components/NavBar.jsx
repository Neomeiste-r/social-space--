import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";
const NavBar = ({ searchTerm, setSearchTerm, user, sideBarFunction }) => {
  const navigate = useNavigate();

  return (
    <motion.div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 bg-black">
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="w-[2rem]"
        onClick={sideBarFunction}
      >
        <FiMenu color="red" fontSize={30} />
      </motion.button>
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1 bg-white" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-white outline-none "
        />
      </div>
      <div className="flex  gap-3 justify-evenly">
        <Link to={`user-profile/${user?.uid}`} className="hidden md:block w-14">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={user?.photoURL}
            alt="user-pic"
            className="w-14 h-12 rounded-lg "
          />
        </Link>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
            to="/create-pin"
            className="bg-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
          >
            <IoMdAdd color="black" className=" bg-white" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NavBar;
