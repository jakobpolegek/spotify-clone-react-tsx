import {
    HeartIcon,
  } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationSidebar = () => {
  return (
      <div className="ml-5 col-span-1 row-span-11 bg-slate-800 rounded">
          <div className="flex flex-wrap items-center ml-2 max-h-screen grow">
            <Link to="/likedSongs">
                <div className="flex flex-row items-center w-60 p-4 mt-4">
                    <HeartIcon color="#0C969C"/>
                    <h1 className="font-bold text-primary text-2xl ml-4">
                        Liked songs
                    </h1>
                </div>
            </Link>
          </div>
      </div>
  );
};

export default NavigationSidebar;
