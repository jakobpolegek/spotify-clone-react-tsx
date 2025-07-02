import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, HomeIcon } from 'lucide-react';
import { Input } from './ui/input.tsx';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: 'w-12 h-12',
  },
};

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (!queryParams.has('q') || path !== '/search') {
      setSearchTerm('');
    }
  }, [window.location.search, window.location.pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="col-span-10 bg-slate-800 rounded mx-4 mt-2">
      <div className="flex mt-2">
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
                : '/'
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
