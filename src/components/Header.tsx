import { Button } from "./ui/button.tsx";
import { ArrowLeft, ArrowRight, Search, Home } from "lucide-react";
import { Input } from "./ui/input.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <div className="col-span-10 bg-slate-800 rounded ml-5 mr-5 mt-2 py-6">
      <div className="flex ">
        <div
          id="navigation"
          className="flex flex-row justify-center items-center w-32"
        >
          <Button variant="link" size="lg">
            <ArrowLeft className="text-primary" size={32} />
          </Button>
          <Button variant="link">
            {" "}
            <ArrowRight className="text-primary" size={32} />
          </Button>
        </div>
        <div className="flex justify-center items-center grow">
          <Button variant="link">
            {" "}
            <Home className="text-primary" size={32} />
          </Button>
          <Input className="w-2/6" />
          <Button variant="link">
            {" "}
            <Search className="text-primary" size={32} />
          </Button>
        </div>
        <div className="text-white mr-4">
          <SignedIn>
            <UserButton />
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
