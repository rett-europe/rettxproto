import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Home } from "./pages/home/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/*
        Example usage:
        <Route
          path="/something"
          element={
            <ProtectedRoute isAllowed={/* your custom role check here *\/}>
              <PageA />
            </ProtectedRoute>
          }
        />
      */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

interface ProtectedRouteProps {
  isAllowed?: boolean;
  children: JSX.Element;
}

/**
 * ProtectedRoute checks whether the user is allowed to access the children.
 * If not, it triggers loginWithRedirect.
 */
function ProtectedRoute({ isAllowed, children }: ProtectedRouteProps): JSX.Element | null {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // If no explicit permission is provided, consider the user allowed if authenticated.
  if (isAllowed === undefined) {
    isAllowed = isAuthenticated;
  }

  useEffect(() => {
    // If the user is not allowed, not loading, and not authenticated,
    // trigger login.
    if (!isAllowed && !isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAllowed, isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    // Optionally, you could render a loading indicator here.
    return null;
  } else {
    return isAllowed ? (children ? children : <Outlet />) : <Unauthorized />;
  }
}

function NotFound() {
  return (
    <main className="p-8 md:px-24">
      <h1>Not Found</h1>
    </main>
  );
}

function Unauthorized() {
  const { logout } = useAuth0();

  function signOut() {
    logout({ returnTo: window.location.origin });
  }

  return (
    <main className="p-8 md:px-24">
      <h1>Unauthorized</h1>
      <button onClick={signOut}>Logout</button>
    </main>
  );
}

export default App;
