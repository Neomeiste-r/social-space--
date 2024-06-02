import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/assets/logo_pic1.png";
import { categories } from "../Utils/data";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-white hover:text-white transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 text-red-500 border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";

function SideBar({ closeToggle, user }) {
  const handleCloseSidebar = () => {
    closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-black h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-[50%]" />
          <h1 className="text-white">My Media</h1>
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl text-white ">
            Discover cateogries
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                alt="category-name"
                className="w-8 h-8 rounded-full shadow-sm"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user.uid}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-black rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.photoURL}
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <p className="text-white">{user.displayName}</p>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
}

export default SideBar;
