// src/utils/httpClient/authFetch.ts
import Auth0Auth from "../auth/auth0Auth";

/**
 * Performs an authenticated REST call.
 * @param {RequestInfo} endpoint The endpoint to call.
 * @param {RequestInit} init The request options.
 * @returns {Promise<Response>} The response.
 */
export async function authFetch(endpoint: RequestInfo, init: RequestInit): Promise<Response> {
  const { body, ...customConfig } = init;

  // Retrieve token using the Auth0 wrapper
  const token = await Auth0Auth.getAccessTokenAsync();
  const headers: Record<string, string> = { "content-type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = body;
  }

  return window.fetch(endpoint, config);
}
