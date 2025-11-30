import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import UseQueryProvider from "./Provider/useQueryProvider.tsx";

createRoot(document.getElementById("app")!).render(
  <UseQueryProvider>
    <App />
  </UseQueryProvider>
);
