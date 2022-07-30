import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";

export type CardProps = {
  deckRef: any;
  index: number;
  cardState: any;
  src: string;
  alt?: string;
};

export const Card = ({ deckRef, index, cardState, src, alt }: CardProps) => {
  const divRef = useRef(null);
  const [positionDiff, setPositionDiff] = useState<any>(null);

  const transformFrom = {
    transform: positionDiff
      ? `translateX(${positionDiff.left}px) translateY(${positionDiff.top}px)`
      : "",
  };

  const transformTo = {
    transform: `translateX(0px) translateY(0px)`,
  };

  const springProps = useSpring({
    from: cardState === "SHOW" ? transformFrom : transformTo,
    delay: cardState === "SHOW" ? (index + 1) * 100 : (index + 1) * 10,
    pause: !positionDiff,
    to: cardState === "SHOW" ? transformTo : transformFrom,
  });

  useEffect(() => {
    const deckPosition = getOffset(deckRef.current);
    const cardPosition = getOffset(divRef.current);
    const nextPositionDiff = {
      left: deckPosition.left - cardPosition.left,
      top: deckPosition.top - cardPosition.top,
    };

    setPositionDiff(nextPositionDiff);
  }, [deckRef, divRef, index, setPositionDiff]);

  return (
    <animated.div
      ref={divRef}
      style={{
        transformStyle: "preserve-3d",
        width: "100px",
        height: "134px",
        position: "relative",
        borderRadius: "5px",
        ...springProps,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100px", height: "134px", borderRadius: "5px" }}
      />
    </animated.div>
  );
};

function getOffset(el: any) {
  if (el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }

  return {
    left: 0,
    top: 0,
  };
}
