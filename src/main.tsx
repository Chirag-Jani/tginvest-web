import { PrivyProvider } from "@privy-io/react-auth";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          disableAutomaticMigration: true,
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);
