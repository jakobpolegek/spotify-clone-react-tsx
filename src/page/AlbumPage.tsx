import { useLoaderData } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";

const AlbumPage = () => {
  const album = useLoaderData();
  const [currentlyPlaying, setCurrentlyPlaying] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = new AudioContext();

  const playback = () => {
    fetch(
      "https://hzlgizemdlicobkkuowk.supabase.co/storage/v1/object/sign/songs/When%20Im%20Gone.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9XaGVuIEltIEdvbmUubXAzIiwiaWF0IjoxNzMyNDQyNTgyLCJleHAiOjE4OTAxMjI1ODJ9.g-PdbbAm97CrYBPgtC4yHFvINmymjvK893Cx4fnZ624&t=2024-11-24T10%3A03%3A02.979Z"
    )
      .then((data) => data.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((decodedAudio) => {
        setCurrentlyPlaying(decodedAudio);
      });
    if (!isPlaying) {
      const playSound = audioContext.createBufferSource();
      playSound.buffer = currentlyPlaying;
      playSound.connect(audioContext.destination);
      playSound.start(audioContext.currentTime);
      setIsPlaying(true);
    }
    playSound.stop();
  };

  return (
    <div className="col-span-7 row-span-11">
      <div id="album-header" className="flex bg-slate-300 text-white">
        <img src={album.cover} className="h-60 w-60 m-4 ml-12 mt-12" />
        <div id="album-metadata" className="flex flex-col mt-auto mb-10">
          Album
          <h1 className="text-8xl font-extrabold mt-2"> {album.title}</h1>
          <h3 className="mt-0"> {album.authors.name}</h3>
        </div>
      </div>
      <div id="songs" className="flex flex-col">
        {album.songs.map((song) => (
          <div
            id="song"
            className="flex flex-row text-white ml-4 mt-4 border-2 items-center"
          >
            <Button>{isPlaying ? <Play /> : <Pause />}</Button>
            <div id="song-metadata" className="flex flex-col">
              <h1 className="ml-4">{song.title}</h1>
              <h3 className="ml-4">{song.author_id}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;
