import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { AnimatePresence } from "framer-motion";

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry
      className="flex animate-slide-fwd"
      breakpointCols={breakpointColumnsObj}
    >
      {pins.length === 0 && (
        <div className=" absolute left-1/2 -translate-x-1/2 font-bold text-2xl text-white">
          No Pins Found!
        </div>
      )}
      {pins?.map((pin) => (
        <Pin key={pin?.uid} pin={pin} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
