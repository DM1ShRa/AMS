import React from "react";
import { NavLink } from "react-router-dom";
import {
  SignInButton,
  SignOutButton,
  useUser,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-transparent p-4">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-black font-bold text-xl">
          RakshaNetra
        </NavLink>
        <div className="flex-1 flex justify-center items-center space-x-4">
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-2 py-0.5 text-slate-950 bg-gray-200 dark:bg-black-50 rounded-lg"
                  : "px-2 py-0.5 text-gray-900 transition-colors duration-300 hover:text-zinc-950 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-black-50 rounded-lg"
              }
            >
              Home
            </NavLink>
            {isSignedIn && (
              <NavLink
                to="/sensors"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-0.5 text-gray-900 bg-gray-200 dark:bg-black-50 rounded-lg"
                    : "px-2 py-0.5 text-gray-900 transition-colors duration-300 hover:text-zinc-950 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-black-50 rounded-lg"
                }
              >
                Sensors
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "px-2 py-0.5 text-zinc-950 bg-gray-200 dark:bg-black-50 rounded-lg"
                  : "px-2 py-0.5 text-gray-900 transition-colors duration-300 hover:text-zinc-950 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-black-50 rounded-lg"
              }
            >
              About
            </NavLink>
          </>
        </div>
        {isSignedIn ? (
          <div className="flex items-center space-x-4">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8", // Adjust avatar size
                  userButtonTrigger: "focus:outline-none", // Remove focus outline
                },
              }}
            />
            <SignOutButton>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-900">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
