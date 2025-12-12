import { router } from "./router";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { AuthProvider } from "./Provider/authProvider";
import AuthInitializer from "./Features/Components/AuthInitializer";
import DebugAuth from "./Features/Components/DebugAuth";
import CartToast from "./Features/Components/CartToast";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <AuthProvider>
          <AuthInitializer />
          <DebugAuth />
          <RouterProvider router={router} />
          <CartToast />
        </AuthProvider>
      </Provider>
    </div>
  );
};

export default App;
