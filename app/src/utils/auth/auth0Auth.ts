// src/utils/auth/auth0Auth.ts
import { Auth0ContextInterface } from "@auth0/auth0-react";

class Auth0Auth {
  // These will be set once the Auth0 context is available.
  private static tokenGetter: (() => Promise<string>) | null = null;
  private static loginFunction: (() => Promise<void>) | null = null;
  private static logoutFunction: (() => void) | null = null;

  /**
   * Initialize the Auth0Auth service with functions from the Auth0 context.
   * Call this from a React component that has access to Auth0 hooks.
   */
  public static initialize(auth0: Auth0ContextInterface) {
    Auth0Auth.tokenGetter = auth0.getAccessTokenSilently;
    Auth0Auth.loginFunction = auth0.loginWithRedirect;
    Auth0Auth.logoutFunction = () =>
      auth0.logout({ returnTo: window.location.origin });
  }

  /**
   * Mimics your existing getAccessTokenAsync method.
   */
  public static async getAccessTokenAsync(): Promise<string | null> {
    if (!Auth0Auth.tokenGetter) {
      throw new Error("Auth0Auth is not initialized");
    }
    try {
      return await Auth0Auth.tokenGetter();
    } catch (error) {
      console.error("Error acquiring token", error);
      return null;
    }
  }

  /**
   * Mimics your current login method.
   */
  public static login(): void {
    if (!Auth0Auth.loginFunction) {
      throw new Error("Auth0Auth is not initialized");
    }
    Auth0Auth.loginFunction();
  }

  /**
   * Mimics your current logout method.
   */
  public static logout(): void {
    if (!Auth0Auth.logoutFunction) {
      throw new Error("Auth0Auth is not initialized");
    }
    Auth0Auth.logoutFunction();
  }
}

export default Auth0Auth;
