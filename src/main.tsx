import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import WelcomePage from "./page/WelcomePage";
import { dark } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    appearance={{
      baseTheme: dark,
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
  >
    <StrictMode>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
    </StrictMode>
  </ClerkProvider>
);
