import { lazy } from "react";

export const publicRoutes = [
  {
    name: "login",
    path: "/",
    component: lazy(() => import("../container/login")),
  },
  {
    name: "register",
    path: "/register",
    component: lazy(() => import("../container/register")),
  },
  {
    name: "404",
    path: "*",
    component: lazy(() => import("../container/404")),
  },
];

export const privateRoutes = [
  {
    name: "dashboard",
    path: "/dashboard",
    component: lazy(() => import("../container/dashboard")),
  },
  {
    name: "userlist",
    path: "/adduser",
    component: lazy(() => import("../container/userlist")),
  },
  {
    name: "userlist",
    path: "/edituser",
    component: lazy(() => import("../container/userlist")),
  },
  {
    name: "404",
    path: "*",
    component: lazy(() => import("../container/404")),
  },
];
