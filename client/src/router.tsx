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
// import Profile from "./Features/Pages/Profile";
// import Orders from "./Features/Pages/Orders";
// import Wishlist from "./Features/Pages/Wishlist";
// import Settings from "./Features/Pages/Settings";
// import Checkout from "./Features/Pages/Checkout";
import ProtectedRoute from "./Features/Components/ProtectRoute";

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
      {
        path: "/product/:id",
        element: <ShopDetail />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      // Public auth routes (should redirect if already authenticated)
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
      // Protected routes (require authentication)
      // {
      //   path: "/profile",
      //   element: (
      //     <ProtectedRoute>
      //       <Profile />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/orders",
      //   element: (
      //     <ProtectedRoute>
      //       <Orders />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/wishlist",
      //   element: (
      //     <ProtectedRoute>
      //       <Wishlist />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/settings",
      //   element: (
      //     <ProtectedRoute>
      //       <Settings />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/checkout",
      //   element: (
      //     <ProtectedRoute>
      //       <Checkout />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);
