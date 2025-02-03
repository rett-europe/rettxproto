import React, { MouseEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  makeStyles,
  MenuItem,
  MenuList,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tooltip,
} from "@fluentui/react-components";
import resolveConfig from "tailwindcss/resolveConfig";
import TailwindConfig from "../../../tailwind.config";

// Example role check function for Auth0 user
// Adjust the claim key as per your Auth0 configuration
const isPlatformAdmin = (user: any): boolean => {
  return (
    user &&
    user["https://your-domain/roles"] &&
    Array.isArray(user["https://your-domain/roles"]) &&
    user["https://your-domain/roles"].includes("PlatformAdmin")
  );
};

const fullConfig = resolveConfig(TailwindConfig);
const useStylesAvatar = makeStyles({
  root: {
    [`@media (min-width: ${(fullConfig?.theme?.screens as Record<string, string>)["md"]})`]: {
      display: "inherit",
      marginLeft: "4px",
      backgroundColor: "#004E8C",
      color: "#FFFFFF",
    },
    display: "none",
  },
});

export enum NavLocation {
  Home = 1,
  Contribute = 2,
}

interface NavItem {
  key: string;
  label: string;
  isPrimary: boolean;
  location?: NavLocation;
  to?: string;
  action?: MouseEventHandler;
  target?: string;
  externalNav?: string;
}

export function HeaderBar({ location }: { location?: NavLocation }) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const stylesAvatar = useStylesAvatar();

  const linkClasses =
    "cursor-pointer hover:no-underline hover:border-b-[3px] h-9 min-h-0 block";
  const linkCurrent = "pointer-events-none border-b-[3px]";

  // Determine if the user is an admin using the Auth0 user object
  const isAdmin = isPlatformAdmin(user);

  // Define sign-in and sign-out functions using Auth0's methods
  function signIn() {
    loginWithRedirect();
  }

  function signOut() {
    logout({ returnTo: window.location.origin });
  }

  // Navigation items, conditionally rendering sign in/out options
  const navItems: (NavItem | null)[] = useMemo(
    () => [
      {
        key: "home",
        label: t("components.header-bar.home"),
        isPrimary: true,
        location: NavLocation.Home,
        to: "/",
      },
      isAdmin
        ? {
            key: "contribute",
            label: t("components.header-bar.contribute"),
            isPrimary: true,
            location: NavLocation.Contribute,
            to: "/editor",
          }
        : null,
      !isAuthenticated
        ? {
            key: "sign-in",
            label: t("components.header-bar.sign-in"),
            isPrimary: true,
            action: signIn,
          }
        : null,
      isAuthenticated
        ? {
            key: "sign-out",
            label: t("components.header-bar.sign-out"),
            isPrimary: false,
            action: signOut,
          }
        : null,
    ],
    [isAuthenticated, isAdmin, t]
  );

  function toggleMenu() {
    setOpenDrawer((prevOpen) => !prevOpen);
  }

  function renderLink(nav: NavItem, className?: string) {
    return (
      <li key={nav.key} className={className}>
        {nav.externalNav ? (
          <a href={nav.externalNav} target={nav.target}>
            {nav.label}
          </a>
        ) : nav.to ? (
          <Link
            className={`${linkClasses} ${
              nav.location && location === nav.location ? linkCurrent : ""
            }`}
            to={nav.to}
            target={nav.target}
          >
            {nav.label}
          </Link>
        ) : (
          <span role="link" tabIndex={0} className={linkClasses} onClick={nav.action}>
            {nav.label}
          </span>
        )}
      </li>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-[24px] w-[38px] object-contain object-left"
            src="/img/logo-small.png"
            alt={t("common.title")}
          />
          <Link type="button" to="/" className="ml-4 border-l-[1.5px] border-l-neutral-500 pl-4">
            <h5>{t("common.title")}</h5>
          </Link>
        </div>
        <nav className="whitespace-nowrap text-lg font-semibold leading-10">
          <ul
            className={
              (openDrawer ? "h-auto w-auto " : "hidden ") +
              "fixed right-0 z-50 -mt-[10px] bg-white px-6 pb-6 pt-12 shadow-md md:relative md:flex md:flex-row md:space-x-3 md:bg-transparent md:p-0 md:pt-0.5 md:shadow-none lg:space-x-10"
            }
          >
            {/* Close button - Small sizes only */}
            <li className="z-90 absolute top-0 right-6 md:hidden">
              <button
                className="cursor-pointer text-right text-3xl hover:no-underline"
                onClick={toggleMenu}
              >
                &times;
              </button>
            </li>

            {/* Primary nav items */}
            {(navItems.filter((o) => o && o.isPrimary) as NavItem[]).map((nav) =>
              renderLink(nav)
            )}

            {/* Only visible on small screens */}
            {(navItems.filter((o) => o && !o.isPrimary) as NavItem[]).map((nav) =>
              renderLink(nav, "md:hidden")
            )}

            {/* User Avatar - Only visible on md screens */}
            {isAuthenticated && user && (
              <li className="flex items-end">
                <Popover withArrow positioning="below">
                  <PopoverTrigger disableButtonEnhancement>
                    <Tooltip content={user.name || ""} relationship="label">
                      <Avatar className={stylesAvatar.root} name={user.name} />
                    </Tooltip>
                  </PopoverTrigger>
                  <PopoverSurface>
                    <div className="-m-4">
                      <MenuList>
                        {(navItems.filter((o) => o && !o.isPrimary) as NavItem[]).map((nav) => (
                          <MenuItem
                            key={nav.key}
                            onClick={
                              nav.to ? () => navigate(nav.to as string) : nav.action
                            }
                          >
                            {nav.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </div>
                  </PopoverSurface>
                </Popover>
              </li>
            )}
          </ul>

          {/* Hamburger icon - only for small screens */}
          <div className="flex items-center text-2xl md:hidden">
            <button onClick={toggleMenu}>&#9776;</button>
          </div>
        </nav>
      </div>
    </>
  );
}