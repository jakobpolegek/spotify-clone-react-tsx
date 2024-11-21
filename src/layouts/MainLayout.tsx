import { Outlet } from "react-router-dom";
import Player from "../components/Player";
import "../index.css";
import NavigationSidebar from "../components/NavigationSidebar.tsx";
import Header from "../components/Header.tsx";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
const MainLayout = () => {
  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center text-primary  bg-slate-900 h-screen">
          <h1 className="text-3xl font-bold">Hi! You need to sign in.</h1>
          <br></br>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="grid grid-cols-8 grid-rows-12 gap-2 m-auto bg-slate-900 h-screen">
          <Header />
          <NavigationSidebar />
          <Outlet />
          <Player />
        </div>
      </SignedIn>
    </>
  );
};

export default MainLayout;
