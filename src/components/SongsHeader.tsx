import {  HeartIcon, MusicIcon } from "lucide-react";
import { ISong } from "../types/ISong";
import { UserResource } from "@clerk/types";
import { IAlbum } from "../types/IAlbum";
import { Authors } from "./Authors";

const SongsHeader = ({ user, songs,page = 0, album=null }: 
    {   user: UserResource, 
        songs:ISong[], 
        page:number,
        album:IAlbum|null
    })=>{
    return(
      <div className="flex bg-slate-800 text-white border-2 rounded border-slate-800">
        <div className="flex items-center mb-6">
          {page===1?
          <HeartIcon className="h-60 w-60 mb-4 ml-12 mt-12 text-primary"/>
          :(page===2 ? <MusicIcon className="h-60 w-60 mb-4 ml-12 mt-12 text-primary"/>
          :album&&<img src={album.cover} className="h-60 w-60 mb-4 ml-12 mt-12" />
          )}
          <div className="flex flex-col ml-6 mt-10">
            {page===0&&<h4 className="">Album</h4>}
            <h1 className={`text-8xl font-extrabold text-white`}>
                {page===1?'Liked songs':(page===2 && songs[0] ? songs[0].name : album?.title)}
            </h1>
            <h3 className="mt-4 text-gray-400 flex flex-row">{page===0 && album ? <Authors authors={album.authors} isHeader={true}/>:
            <>
              {user.firstName},
            </>} 
              &ensp;{songs.length} songs
            </h3>
          </div>
        </div>
      </div>
    );    
}

export default SongsHeader;