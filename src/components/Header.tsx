import { ArrowLeft, ArrowRight, Search, Home } from "lucide-react";
import { Input } from "./ui/input.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: "w-12 h-12",
  },
};

const Header = () => {
  return (
    <div className="col-span-10 bg-slate-800 rounded ml-5 mr-5 mt-2">
      <div className="flex mt-4">
        <div
          id="navigation"
          className="flex flex-row justify-center gap-4 items-center w-32"
        >
          <Link to="/">
            <ArrowLeft className="text-primary" size={22} />
          </Link>
          <Link to="/">
            {" "}
            <ArrowRight className="text-primary" size={24} />
          </Link>
        </div>
        <div className="flex justify-center items-center grow mb-2">
          <Link to="/">
            {" "}
            <Home className="text-primary " size={24} />
          </Link>
          <Input className="w-2/6 mx-3" />
          <Link to="/">
            {" "}
            <Search className="text-primary" size={24} />
          </Link>
        </div>
        <div className="text-white mr-4">
          <SignedIn>
            <UserButton appearance={userButtonAppearance} />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
