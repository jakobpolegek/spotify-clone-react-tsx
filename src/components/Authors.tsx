import { Link } from "react-router-dom";
import { IAuthor } from "../types/IAuthor";

export const Authors = ({authors, isHeader}:{authors:IAuthor[], isHeader:boolean}) => {
  return (
    <div className="text-gray-400 ml-1flex-row">
      {authors.map((author: IAuthor, index:number) => 
          (index + 1 === authors.length) ? 
              <Link to={`/artist/${author.id}`} key={author.id}>{author.name}</Link>
          : 
              <Link to={`/artist/${author.id}`} key={author.id}>{author.name},&nbsp;</Link>
      )}
      {isHeader && ','}
    </div>
  );
};
