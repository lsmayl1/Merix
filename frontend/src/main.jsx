import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider, queryClient } from "./components/Context/ApiContex.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiProvider>
    </QueryClientProvider>
  </>
);
