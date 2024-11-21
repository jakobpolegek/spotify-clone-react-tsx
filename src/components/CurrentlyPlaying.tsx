const CurrentlyPlaying = () => {
  return (
    <div className="flex flex-row items-end  w-auto mb-2">
      <img
        width="50"
        height="50"
        className="m-1 ml-5"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F49%2F5f%2F38%2F495f383e08783f4af4b294e86bae0850.jpg"
      />
      <div id="song" className="flex flex-col items-start mx-2 mb-3">
        <h3 id="title" className="font-bold text-white">
          {" "}
          Ringa Niga Raja
        </h3>
        <h3 id="artist" className="text-gray-300">
          {" "}
          Eminem
        </h3>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
