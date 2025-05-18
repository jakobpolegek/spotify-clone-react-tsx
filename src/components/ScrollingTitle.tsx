import { useState, useRef, useEffect } from "react";

export function ScrollingTitle({ title }: { title: string }) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [duplicatedTitle, setDuplicatedTitle] = useState(title);
  const [animationDuration, setAnimationDuration] = useState(0);

  // Check if text is overflowing and set up the duplicated text for seamless scrolling
  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      const isTextOverflowing =
        titleRef.current.scrollWidth > containerRef.current.clientWidth;
      setIsOverflowing(isTextOverflowing);

      if (isTextOverflowing) {
        // Add space and duplicate the title for continuous scrolling
        setDuplicatedTitle(`${title}     ${title}`);

        // Calculate animation duration based on text length (slower for longer texts)
        // Using a slower base speed of 30s for standard text length
        const baseSpeed = 5; // seconds
        const standardLength = 30; // characters
        const speedFactor = Math.max(1, title.length / standardLength);
        setAnimationDuration(baseSpeed * speedFactor);
      }
    }
  }, [title]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={titleRef}
        className={`font-medium text-white text-xl whitespace-nowrap ${
          isOverflowing && isHovering ? "animate-marquee" : ""
        }`}
        style={{
          animation:
            isOverflowing && isHovering
              ? `marquee ${animationDuration}s linear infinite`
              : "none",
          transform: !isHovering ? "translateX(0)" : undefined,
        }}
      >
        {isOverflowing ? duplicatedTitle : title}
      </div>

      {/* Add keyframes for the animation */}
      {isOverflowing && (
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      )}
    </div>
  );
}
