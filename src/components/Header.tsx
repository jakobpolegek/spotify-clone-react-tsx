import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
  HomeIcon,
} from "lucide-react";
import { Input } from "./ui/input.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: "w-12 h-12",
  },
};

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setPrevLocation(location.pathname);
    }
  }, [location.pathname]);

  const handleSearchChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate(prevLocation);
    }
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && searchTerm.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="col-span-10 bg-slate-800 rounded ml-4 mr-5 md:mr-4 mt-2">
      <div className="flex mt-2 ">
        <div
          id="navigation"
          className="flex flex-row justify-center gap-4 items-center w-32 mb-1"
        >
          <Link to="/">
            <ArrowLeftIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8" />
          </Link>
          <Link to="/">
            {" "}
            <ArrowRightIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8" />
          </Link>
        </div>
        <div className="flex justify-center items-center grow mb-2">
          <Link to="/">
            {" "}
            <HomeIcon className="text-primary size-5 md:size-8" />
          </Link>
          <Input
            id="search"
            className="w-2/6 mx-3 border-primary"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
          />
          <Link
            to={
              searchTerm.trim()
                ? `/search?q=${encodeURIComponent(searchTerm)}`
                : "/"
            }
          >
            {" "}
            <SearchIcon className="text-primary size-5 md:size-8" />
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
