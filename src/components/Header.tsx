import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, HomeIcon } from "lucide-react";
import { Input } from "./ui/input.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: "w-12 h-12",
  },
};

const Header = () => {
  return (
    <div className="col-span-10 bg-slate-800 rounded ml-4 mr-4 mt-2">
      <div className="flex mt-2 md:mt-6">
        <div
          id="navigation"
          className="flex flex-row justify-center gap-4 items-center w-32"
        >
          <Link to="/">
            <ArrowLeftIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8"/>
          </Link>
          <Link to="/">
            {" "}
            <ArrowRightIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8"/>
          </Link>
        </div>
        <div className="flex justify-center items-center grow mb-2">
          <Link to="/">
            {" "}
            <HomeIcon className="text-primary size-5 md:size-8"/>
          </Link>
          <Input className="w-2/6 mx-3 border-primary" />
          <Link to="/">
            {" "}
            <SearchIcon className="text-primary size-5 md:size-8"/>
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
