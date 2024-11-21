import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./page/HomePage";
import ErrorPage from "./page/ErrorPage";
import ProfilePage from "./page/ProfilePage";
import AlbumPage from "./page/AlbumPage";
import ArtistPage from "./page/ArtistPage";
import MainLayout from "./layouts/MainLayout";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} errorElement={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
      <Route
        path="/profile"
        element={<ProfilePage />}
        errorElement={<ErrorPage />}
      />
      <Route
        path="/artist/:artistId/album/:albumId"
        element={<AlbumPage />}
        errorElement={<ErrorPage />}
      />
      <Route
        path="/artist/:artistId"
        element={<ArtistPage />}
        errorElement={<ErrorPage />}
      />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
