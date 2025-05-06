import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Spinner } from "../components/ui/spinner";

const SearchPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");
  useEffect(() => {
    if (query) {
      setLoading(false);
    }
  }, [query]);

  return loading ? (
    <Spinner show={loading} size="large" />
  ) : (
    <p className="text-white">Found: {query}</p>
  );
};

export default SearchPage;
