import { SignInButton } from "@clerk/clerk-react";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-primary  bg-slate-900 h-screen">
      <h1 className="text-3xl font-bold">Hi! You need to sign in.</h1>
      <br />
      <SignInButton />
    </div>
  );
};

export default WelcomePage;
