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
        <Toaster />
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 grid-rows-[auto_1fr_auto] md:grid-rows-12 gap-1 md:gap-2 bg-slate-900 h-screen">
          <Header/>
          <NavigationSidebar/>
          <Outlet />
          <Player/>
        </div>
      </SignedIn>
    </>
  );
};

export default MainLayout;
