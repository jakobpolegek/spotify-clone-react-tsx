import { Outlet } from "react-router-dom";
import Player from "../components/Player";
import "../index.css";
import NavigationSidebar from "../components/NavigationSidebar.tsx";
import Header from "../components/Header.tsx";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import WelcomePage from "../page/WelcomePage.tsx";
import { Toaster } from "../components/ui/toaster";

const MainLayout = () => {
  return (
    <>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
      <SignedIn>
        <Toaster />
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 grid-rows-[auto_1fr_auto] gap-2 h-screen bg-slate-900 overflow-hidden">
          <Header />
          <NavigationSidebar />
          <div
            id="outlet"
            className="col-span-8 md:col-span-10 lg:col-span-9 row-span-1 overflow-hidden h-[calc(100vh-186px)]"
          >
            <Outlet />
          </div>
          <div
            id="player"
            className="col-span-1 md:col-span-4 lg:col-span-6 xl:col-span-8 self-end"
          >
            <Player />
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default MainLayout;
