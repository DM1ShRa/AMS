import { useUser } from "@clerk/clerk-react";

export const checkRole = (role) => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return false;
  }

  const userRole = user?.publicMetadata?.role || "user";
  return userRole === role;
};
