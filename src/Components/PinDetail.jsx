import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { database } from "../firebaseConfig";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [pinDetail, setPinDetail] = useState();
  console.log("comment user", pinDetail);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!pinDetail.category) {
        // User is not authenticated, or user.uid is not available yet
        return;
      }

      const pinsRef = ref(database, "pins");
      const Query = query(
        pinsRef,
        orderByChild("category"),
        equalTo(pinDetail.category)
      );
      onValue(
        Query,
        (snapshot) => {
          try {
            const matchingPosts = snapshot.val();

            // Convert the object into an array
            const matchingPostsArray = Object.values(matchingPosts);

            const filteredArray = matchingPostsArray.filter(
              (obj) => obj.pinId !== pinDetail.pinId
            );

            setRelatedPosts(filteredArray);
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

    if (pinDetail) {
      fetchRelatedPosts();
    }
  }, [pinDetail]);

  const fetchPinDetails = async () => {
    try {
      const pinRef = ref(database, "pins/" + pinId);
      const pinSnapshot = await get(pinRef);

      if (pinSnapshot.exists()) {
        const pinData = pinSnapshot.val();
        setPinDetail(pinData);
      } else {
        setPinDetail(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = async (pinId, comment, user) => {
    try {
      const pinRef = ref(database, "pins/" + pinId);
      const pinSnapshot = await get(pinRef);

      if (pinSnapshot.exists()) {
        const pinData = pinSnapshot.val();

        // Create a new comment object
        const newComment = {
          userId: user.uid,
          username: user.displayName,
          userImage: user.photoURL,
          text: comment,
        };

        // Add the new comment to the pin's comments
        const updatedComments = pinData.comments || [];
        updatedComments.push(newComment);

        // Update the comments array in the pinData
        const updatedPinData = {
          ...pinData,
          comments: updatedComments,
        };

        // Update the pinData in the database
        await set(pinRef, updatedPinData);

        window.location.reload();
      } else {
        setPinDetail(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-black"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <motion.div
            initial={{ y: 40, x: -40 }}
            animate={{ y: 0, x: 0 }}
            transition={{
              ease: [0.6, 0.01, -0.05, 0.95],
              duration: 0.5,
            }}
            className="flex justify-center items-center md:items-start flex-initial border-2 border-red-600 w-full lg:w-[60vw] mt-[40px] lg:mt-0 h-[90vh] rounded-t-3xl rounded-b-lg"
          >
            <img
              className="rounded-t-3xl rounded-b-lg h-full w-full object-cover"
              src={pinDetail?.imageUrl}
              alt="user-post"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full p-5 flex-1 xl:min-w-620 "
          >
            <div className="flex items-center justify-between ">
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3 text-white">
                {pinDetail.title}
              </h1>
              <p className="mt-3 text-white ">{pinDetail.about}</p>
            </div>
            <Link
              to={`/user-profile/${pinDetail?.postedBy.userId}`}
              className="flex gap-2 mt-5 items-center bg-black rounded-lg "
            >
              <img
                src={pinDetail?.postedBy.userImage}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold text-white ">
                {pinDetail?.postedBy.userName}
              </p>
            </Link>
            <h2 className="mt-5 text-2xl text-white">Comments</h2>
            <div className="max-h-370 overflow-y-auto ">
              {pinDetail?.comments?.map((item, idx) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-black rounded-lg text-white "
                  key={idx}
                >
                  <Link to={`/user-profile/${item.userId}`}>
                    <img
                      src={item.userImage}
                      className="w-10 h-10 rounded-full cursor-pointer "
                      alt="user-profile"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="font-bold">{item.username}</p>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user.uid}`}>
                <img
                  src={user.photoURL}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={() => addComment(pinId, comment, user)}
              >
                {addingComment ? "Adding..." : "Done"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {relatedPosts?.length > 0 && (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4 text-white ">
            More like this
          </h2>
        </>
      )}

      {relatedPosts ? (
        <MasonryLayout pins={relatedPosts} />
      ) : (
        <div className="mt-[20px]">
          <Spinner message="Loading more pins" />
        </div>
      )}
    </>
  );
};

export default PinDetail;
