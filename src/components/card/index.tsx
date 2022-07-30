import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { CardImage } from "./styled";
import BackOfCard from "../../assets/back-of-card.jpeg";

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
      ? `translateX(${positionDiff.left}px) translateY(${positionDiff.top}px) rotateY(180deg)`
      : "",
  };

  const transformTo = {
    transform: `translateX(0px) translateY(0px) rotateY(0deg)`,
  };

  const springProps = useSpring({
    from:
      cardState === "SHOW" || cardState === "SORT"
        ? transformFrom
        : transformTo,
    to:
      cardState === "SHOW" || cardState === "SORT"
        ? transformTo
        : transformFrom,
    delay: cardState === "SHOW" ? (index + 1) * 1000 : (index + 1) * 100,
    pause: !positionDiff,
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
        backfaceVisibility: "hidden",
        ...springProps,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          margin: "auto",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          border: "1px solid #808080",
          borderRadius: "5px",
        }}
      >
        <CardImage src={BackOfCard} alt={alt} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          margin: "auto",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
        }}
      >
        <CardImage src={src} alt={alt} />
      </div>
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
