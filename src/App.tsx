import { SignedIn, SignedOut, useSession } from '@clerk/clerk-react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import HomePage from './page/HomePage';
import ProfilePage from './page/ProfilePage';
import AlbumPage from './page/AlbumPage';
import AuthorPage from './page/AuthorPage';
import ErrorPage from './page/ErrorPage';
import WelcomePage from './page/WelcomePage';
import { store } from './store';
import { getAlbumWithFiles } from './utils/api/getAlbumWithFiles';
import { getAlbums } from './utils/api/getAlbums';
import LikedSongsPage from './page/LikedSongsPage';
import { getAuthor } from './utils/api/getAuthor';
import { setCurrentSession, isSessionActive } from './utils/supabase';
import { useEffect } from 'react';
import PlaylistPage from './page/PlaylistPage';
import SearchPage from './page/SearchPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
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
        loader={getAlbums}
        errorElement={<ErrorPage />}
      />
      <Route path="*" element={<ErrorPage />} />
      <Route
        path="/search"
        element={
          <>
            <SignedIn>
              <SearchPage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        errorElement={<ErrorPage />}
      />
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
        path="/artist/:authorId"
        element={
          <>
            <SignedIn>
              <AuthorPage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        loader={getAuthor}
        errorElement={<ErrorPage />}
      />
      <Route
        path="/playlist/:playlistId"
        element={
          <>
            <SignedIn>
              <PlaylistPage />
            </SignedIn>
            <SignedOut>
              <WelcomePage />
            </SignedOut>
          </>
        }
        errorElement={<ErrorPage />}
      />
      <Route
        path="/likedSongs"
        element={
          <>
            <SignedIn>
              <LikedSongsPage />
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
  const { session } = useSession();
  useEffect(() => {
    if (isSessionActive(session)) {
      setCurrentSession(session);
    } else {
      setCurrentSession(null);
    }
  }, [session]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
