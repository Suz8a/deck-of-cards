import React, { CSSProperties } from "react";

import { DeckOfCards } from "./styled";

export type DeckOfCardsProps = {
  className?: string;
  style?: CSSProperties;
};

export const Deck = React.forwardRef(
  ({ className, style }: DeckOfCardsProps, ref) => {
    return <DeckOfCards className={className} style={style} ref={ref as any} />;
  }
);
