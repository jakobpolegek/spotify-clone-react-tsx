import { Outlet } from "react-router-dom";
import Player from "../components/Player";
import "../index.css";
import NavigationSidebar from "../components/NavigationSidebar.tsx";
import Header from "../components/Header.tsx";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import WelcomePage from "../page/WelcomePage.tsx";
import { Toaster } from "../components/ui/toaster"

const MainLayout = () => {
  return (
    <>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
      <SignedIn>
        <div className="grid grid-cols-8 grid-rows-12 gap-2 m-auto bg-slate-900 h-screen">
          <Header />
          <NavigationSidebar />
          <Outlet />
          <Player />
          <Toaster/>
        </div>
      </SignedIn>
    </>
  );
};

export default MainLayout;
