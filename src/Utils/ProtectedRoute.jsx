import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import Spinner from "../Components/Spinner";

function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false); // Authentication state has been fetched
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Spinner />; // Show a loading indicator while checking auth state
  }

  return user ? <Outlet /> : <Navigate to="/login" />; // Render a loading indicator while fetching user data
}

export default ProtectedRoute;
