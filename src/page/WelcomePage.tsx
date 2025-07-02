import { SignInButton } from '@clerk/clerk-react';

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center text-center justify-center text-primary  bg-slate-900 h-screen">
      <p className="text-3xl font-bold mb-4">Hello!</p>
      <p className="text-2xl font-bold">
        Before using this app, you need to<br></br>&nbsp;
        <SignInButton>
          <button>sign in.</button>
        </SignInButton>
      </p>
    </div>
  );
};

export default WelcomePage;
