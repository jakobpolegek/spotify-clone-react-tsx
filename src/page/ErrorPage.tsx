import { Link } from "react-router-dom";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const code = error?.status || "404";
  const message = error?.message || "Not found.";
  return (
    <section className="flex flex-col justify-center items-center h-96 m-auto text-white text-center">
      <FaTriangleExclamation className="text-yellow-400 text-6xl" />
      <h1 className="my-4 text-6xl font-bold mb-4">{code}</h1>
      <p className="text-xl mb-5">{message}</p>
      <Link
        to="/"
        className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
      >
        Go Back
      </Link>
    </section>
  );
};

export default ErrorPage;
