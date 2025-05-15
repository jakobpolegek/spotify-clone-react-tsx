import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: "w-12 h-12",
  },
};

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (navHistory.length === 0) {
      setNavHistory([currentPath]);
      setCurrentIndex(0);
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (navHistory[currentIndex] !== currentPath) {
      const newHistory = [
        ...navHistory.slice(0, currentIndex + 1),
        currentPath,
      ];
      setNavHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }
  }, [location]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < navHistory.length - 1;

  const prevPath = canGoBack ? navHistory[currentIndex - 1] : "#";
  const nextPath = canGoForward ? navHistory[currentIndex + 1] : "#";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="col-span-10 bg-slate-800 rounded ml-4 mr-5 md:mr-4 mt-2">
      <div className="flex mt-2">
        <div className="flex flex-row justify-center gap-4 items-center w-32 mb-1">
          <Link
            to={prevPath}
            replace
            className={!canGoBack ? "opacity-50 cursor-default" : ""}
            onClick={(e) => {
              if (!canGoBack) {
                e.preventDefault();
              } else {
                setCurrentIndex((prev) => prev - 1);
              }
            }}
          >
            <ArrowLeftIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8" />
          </Link>

          <Link
            to={nextPath}
            replace
            className={!canGoForward ? "opacity-50 cursor-default" : ""}
            onClick={(e) => {
              if (!canGoForward) {
                e.preventDefault();
              } else {
                setCurrentIndex((prev) => prev + 1);
              }
            }}
          >
            <ArrowRightIcon className="text-primary mb-1 md:mb-0 size-5 md:size-8" />
          </Link>
        </div>

        <div className="flex justify-center items-center grow mb-2">
          <Link to="/">
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
