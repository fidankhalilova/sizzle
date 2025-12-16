// src/router.tsx
import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./Features/Pages/Home";
import Shop from "./Features/Pages/Shop";
import FAQ from "./Features/Pages/FAQ";
import Blog from "./Features/Pages/Blog";
import ContactUs from "./Features/Pages/ContactUs";
import Register from "./Features/Pages/Register";
import Login from "./Features/Pages/Login";
import ShopDetail from "./Features/Pages/ShopDetail";
import BlogDetail from "./Features/Pages/BlogDetail";
import ProtectedRoute from "./Features/Components/ProtectRoute";
import Checkout from "./Features/Pages/Checkout";
import Orders from "./Features/Pages/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      // Updated: Dynamic product route with :id parameter
      {
        path: "/product/:id",
        element: <ShopDetail />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Orders />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
