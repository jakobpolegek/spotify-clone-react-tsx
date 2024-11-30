import { useLoaderData } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

const AlbumPage = () => {
  const album = useLoaderData();

  const [audioSource, setAudioSource] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState();
  const [startTime, setStartTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = new AudioContext();

  const playAudio = async () => {
    if (!isPlaying) {
      try {
        const response = await fetch(
          "https://hzlgizemdlicobkkuowk.supabase.co/storage/v1/object/sign/songs/When%20Im%20Gone.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9XaGVuIEltIEdvbmUubXAzIiwiaWF0IjoxNzMyNDQyNTgyLCJleHAiOjE4OTAxMjI1ODJ9.g-PdbbAm97CrYBPgtC4yHFvINmymjvK893Cx4fnZ624&t=2024-11-24T10%3A03%3A02.979Z"
        );
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = decodedAudio;
        source.connect(audioContext.destination);

        const currentStartTime = audioContext.currentTime;
        setStartTime(currentStartTime);

        source.start(currentStartTime, pausedTime);

        setAudioSource(source);
        setCurrentlyPlaying(decodedAudio);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const pauseAudio = () => {
    if (isPlaying && audioSource) {
      const elapsedTime = audioContext.currentTime - startTime + pausedTime;
      audioSource.stop();
      setPausedTime(elapsedTime);
      setIsPlaying(false);
    }
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
            key={song.id}
            className="flex flex-row text-white ml-4 mt-4 border-2 items-center"
          >
            {!isPlaying ? (
              <Button
                key={song.id}
                onClick={() => {
                  playAudio();
                }}
              >
                Play
              </Button>
            ) : (
              <Button key={song.id} onClick={pauseAudio}>
                Pause
              </Button>
            )}
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
