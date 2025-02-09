import { Link } from "react-router-dom";
import { IAuthor } from "../types/IAuthor";

export const Authors = ({authors}:{authors:IAuthor[]}) => {
  return (
    <div className="text-gray-400 flex-row">
        {authors.map((author: IAuthor, index:number) => 
            (index + 1 === authors.length) ? 
                <Link to={`/artist/${author.id}`} key={author.id}>{author.name}</Link>
            : 
                <Link to={`/artist/${author.id}`} key={author.id}>{author.name},&nbsp;</Link>
        )}
    </div>
  );
};
