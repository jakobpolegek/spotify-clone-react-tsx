import { SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./page/HomePage";
import ProfilePage from "./page/ProfilePage";
import AlbumPage from "./page/AlbumPage";
import ArtistPage from "./page/ArtistPage";
import ErrorPage from "./page/ErrorPage";
import WelcomePage from "./page/WelcomePage";
import { store } from "./store";
import { getAlbumWithFiles } from "./utils/api/getAlbumWithFiles";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

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

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
