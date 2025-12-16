import { router } from "./router";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { AuthProvider } from "./Provider/authProvider";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Provider>
    </div>
  );
};

export default App;
