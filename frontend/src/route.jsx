import Index from "./pages";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/register";
import { jwtDecode } from "jwt-decode";
import { removeCookie } from "./lib/cookies";
import { getCookie } from "@/lib/cookies";
import { useNavigate } from "react-router";

export const auth = () => {
  // Check if user is logged in or not
  // If user is logged in, return true. Otherwise, return false.
  const token = getCookie("token");
  
  return { status: token ? true : false, session: jwtDecode(token)|| null};
};
auth.logout =async () => {
  if (!getCookie("token")) {
    return "User is not logged in";
  }
  const logout=await fetch("http://localhost:3000/logout",{
    credentials:"include",
    method:"GET"
  })
  return logout
};



export const RouteConfig = [
  {
    path: "/",
    Component: Index,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
];