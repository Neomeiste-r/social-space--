import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "./Utils/ProtectedRoute";
import Spinner from "./Components/Spinner";
import { auth } from "./firebaseConfig";

const Login = React.lazy(() => import("./Components/Login"));
const Home = React.lazy(() => import("./Containers/Home"));

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="*" element={<Home user={user} />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
