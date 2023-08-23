import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import "../node_modules/modern-normalize/modern-normalize.css";
import { AboutModal } from "./components/Header/components/AboutModal.tsx";
import { LoginModal } from "./components/Header/components/LoginModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "about",
        element: <AboutModal />,
      },
      {
        path: "login",
        element: <LoginModal />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
