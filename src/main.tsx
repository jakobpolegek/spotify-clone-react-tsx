import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import HomePage from "./page/HomePage";
import ErrorPage from "./page/ErrorPage";
import ProfilePage from "./page/ProfilePage";
import AlbumPage from "./page/AlbumPage";
import ArtistPage from "./page/ArtistPage";
import MainLayout from "./layouts/MainLayout";
import { Provider } from "react-redux";
import { store } from "./store";
import { getAlbumWithFiles } from "./utils/api/getAlbumWithFiles";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import AudioContextService from "./utils/audioContextService";
import { getAlbums } from "./utils/api/getAlbums";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import WelcomePage from "./page/WelcomePage.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
AudioContextService.getInstance();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <SignedIn>
            <MainLayout />
          </SignedIn>
          <SignedOut>
            <WelcomePage />
          </SignedOut>
        </>
      }
      errorElement={<ErrorPage />}
    >
      <Route
        index
        element={
          <>
            <SignedIn>
              <HomePage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        loader={getAlbums}
        errorElement={<ErrorPage />}
      />
      <Route path="*" element={<ErrorPage />} />
      <Route
        path="/profile"
        element={
          <>
            <SignedIn>
              <ProfilePage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        errorElement={<ErrorPage />}
      />
      <Route
        path="/artist/:authorId/albums/:albumId"
        element={
          <>
            <SignedIn>
              <AlbumPage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        loader={getAlbumWithFiles}
        errorElement={<ErrorPage />}
      />
      <Route
        path="/artist/:artistId"
        element={
          <>
            <SignedIn>
              <ArtistPage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        errorElement={<ErrorPage />}
      />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
