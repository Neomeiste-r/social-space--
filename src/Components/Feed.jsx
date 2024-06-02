import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../firebaseConfig";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { ref, get } from "firebase/database";
import { AnimatePresence } from "framer-motion";

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchPinsData = async () => {
      try {
        const pinsRef = ref(database, "pins/");
        const pinsSnapshot = await get(pinsRef);

        if (pinsSnapshot.exists()) {
          const pinsData = pinsSnapshot.val();
          const pinsArray = Object.values(pinsData); // Convert object to array

          if (categoryId) {
            const filteredPins = pinsArray.filter(
              (pin) => pin.category === categoryId
            );

            setPins(filteredPins); // Set filtered data to state
          } else {
            setPins(pinsArray); // Set all data to state if no categoryId
          }
        }

        setLoading(false); // Set loading to false after data retrieval
      } catch (error) {
        console.error("Error:", error);
        setLoading(false); // Make sure to set loading to false even on error
      }
    };

    fetchPinsData();
  }, [categoryId]);

  const ideaName = categoryId || "new";
  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }
  return (
    <AnimatePresence mode="wait">
      {pins && <MasonryLayout pins={pins} />}
    </AnimatePresence>
  );
};

export default Feed;
