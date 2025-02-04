// src/App.tsx
import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/layout";
//import { Telemetry } from "./utils/telemetry/telemetry";
//import { AppInsightsContext, ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { Auth0Provider } from "@auth0/auth0-react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import resolveConfig from "tailwindcss/resolveConfig";
import TailwindConfig from "../tailwind.config";
import AppRoutes from "./AppRoutes";
import { SnackbarProvider } from "notistack";
import { SnackbarSuccess } from "./components/snackbar/snackbarSuccess";
import { SnackbarError } from "./components/snackbar/snackbarError";
import { Auth0Initializer } from "./utils/auth/Auth0Initializer"; // our new initializer

/* Application insights initialization */
//const reactPlugin: ReactPlugin = Telemetry.initAppInsights(window.ENV.APP_INSIGHTS_CS, true);

// FluentUI v9 theme customization using tailwind defined values
const fullConfig = resolveConfig(TailwindConfig);
// Adjust theme colors based on tailwind values
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
webLightTheme.colorBrandForegroundLink = (fullConfig.theme!.colors as any).primary["100"];
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
webLightTheme.colorNeutralForeground1 = (fullConfig.theme!.colors as any).black;

function App() {
    return (
        <Suspense>
            <Auth0Provider
                domain={import.meta.env.VITE_AUTH0_DOMAIN}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                }}
            >
                {/* This component initializes our Auth0-based wrapper so that the rest of the app can continue calling
                    the same methods as before (e.g., getAccessTokenAsync, logout, etc.) */}
                <Auth0Initializer />
                    <FluentProvider theme={webLightTheme}>
                        <BrowserRouter>
                            <SnackbarProvider
                                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                Components={{ success: SnackbarSuccess, error: SnackbarError }}
                            >
                                <Layout>
                                    <AppRoutes />
                                </Layout>
                            </SnackbarProvider>
                        </BrowserRouter>
                    </FluentProvider>
            </Auth0Provider>
        </Suspense>
    );
}

export default App;
