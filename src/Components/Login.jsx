import React, { useState } from "react";
import shareVideo from "../assets/assets/share.mp4";
import logo from "../assets/assets/logo_pic1.png";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, database } from "../firebaseConfig";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

function Login() {
  const [error, setError] = useState(null);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, uid, photoURL } = result.user;

      const userRef = ref(database, "users/" + uid);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        // If the user doesn't exist, create a new entry
        await set(userRef, {
          displayName,
          photoURL,
          uid,
        });
      }
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen overflow-hidden">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full  object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5 gap-1 flex justify-center items-center">
            <img src={logo} width="90px" alt="logo" />
            <h1 className="text-xl">My Media</h1>
          </div>

          <div className="shadow-2xl">
            <button className="button-6" onClick={handleClick}>
              Sign in / Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
