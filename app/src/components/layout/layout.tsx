import React from "react";
import { Footer } from "../footer/footer";
import { useAuth0 } from "@auth0/auth0-react";

export function Layout({ children }: { children?: React.ReactNode }) {
  const { isLoading } = useAuth0();

  // Optionally, you could render a loader/spinner while Auth0 is loading.
  if (isLoading) {
    return null;
  }

  return (
    <>
      {children}
      <Footer />
    </>
  );
}
