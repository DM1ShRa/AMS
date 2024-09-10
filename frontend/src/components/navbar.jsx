import React from "react";
import { Link } from "react-router-dom";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <nav>
      {isSignedIn && <Link to="/">Home</Link>}
      {isSignedIn && <Link to="/sensors">Sensors</Link>}
      {isSignedIn && <Link to="/about">About</Link>}
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
    </nav>
  );
};

export default Navbar;
