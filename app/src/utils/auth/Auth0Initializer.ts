// src/utils/auth/Auth0Initializer.tsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0Auth from "./auth0Auth";

export const Auth0Initializer: React.FC = () => {
  const auth0 = useAuth0();

  useEffect(() => {
    // Initialize our wrapper with Auth0's methods
    Auth0Auth.initialize(auth0);
  }, [auth0]);

  return null;
};
