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
import ProtectedRoute from "./Auth/ProtectRoot";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
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
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <div>My Orders Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <div>Wishlist Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <div>Settings Page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
