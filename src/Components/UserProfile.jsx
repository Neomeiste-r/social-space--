import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { FiMenu } from "react-icons/fi";
import { auth, database } from "../firebaseConfig";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  onValue,
} from "firebase/database";
import { signOut } from "firebase/auth";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 bg-white text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = ({ toggleSidebar, sideBarFunction }) => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState([]);
  const [text, setText] = useState("Created");

  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  const [savedPins, setSavedPins] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(database, "users/" + userId); // Use the UID of the current user
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          setUser(userSnapshot.val());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (user && user.savedPins) {
      const fetchSavedPins = async () => {
        try {
          const savedPinsPromises = user.savedPins.map(async (pinId) => {
            const pinRef = ref(database, `pins/${pinId}`);
            const pinSnapshot = await get(pinRef);
            return pinSnapshot.exists() ? pinSnapshot.val() : null;
          });

          const savedPinsData = await Promise.all(savedPinsPromises);
          const filteredSavedPins = savedPinsData.filter((pin) => pin !== null);
          setSavedPins(filteredSavedPins);
        } catch (error) {
          console.error("Error fetching saved pins:", error);
        }
      };

      fetchSavedPins();
    }
  }, [user]);

  useEffect(() => {
    const fetchPins = () => {
      if (!user || !user.uid) {
        // User is not authenticated, or user.uid is not available yet
        return;
      }

      const pinsRef = ref(database, "pins");
      const userPinsQuery = query(
        pinsRef,
        orderByChild("postedBy/userId"),
        equalTo(user?.uid)
      );

      onValue(
        userPinsQuery,
        (snapshot) => {
          try {
            const matchingPosts = snapshot.val();

            // Convert the object into an array
            const matchingPostsArray = Object.values(matchingPosts);

            setPins(matchingPostsArray);
            // Process and store the posts in your state or variable
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        },
        {
          onlyOnce: true, // Fetch data once and detach the listener
        }
      );
    };

    fetchPins();
  }, [user]);

  async function handleLogout() {
    try {
      await signOut(auth);
      // Additional asynchronous cleanup or actions can go here
      // Example: Clear user-related data from app state
      // await clearUserData();

      navigate("/login", { replace: true });
    } catch {
      console.log("failed to logout");
    }
  }

  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className=" w-full h-[80vh] 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.photoURL}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3 text-white">
            {user.displayName}
          </h1>
          <div className="fixed md:top-0 z-10 right-0 pr-5 bg-transparent ">
            <button
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              onClick={handleLogout}
              type="button"
            >
              <AiOutlineLogout className="bg-white" color="red" fontSize={21} />
            </button>
          </div>
          <motion.div
            className="fixed top-0 left-0 p-2 z-1 bg-transparent"
            initial={{ marginLeft: 0 }}
            animate={{ marginLeft: toggleSidebar ? 200 : 0 }}
            transition={{ duration: 0.7 }}
          >
            <button
              className="w-[2rem] ml-1 bg-transparent "
              onClick={sideBarFunction}
            >
              <FiMenu className="bg-transparent" color="red" fontSize={30} />
            </button>
          </motion.div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        {activeBtn === "saved" && (
          <div className="px-2">
            <MasonryLayout pins={savedPins} />
          </div>
        )}

        {activeBtn === "created" && (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        )}

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
