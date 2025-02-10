import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import QueryProvider from "./components/providers/quary,providers.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <QueryProvider>
        <App />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  </BrowserRouter>
);
