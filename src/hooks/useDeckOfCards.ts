import { useCallback, useEffect, useState } from "react";
import { getAllCards, getDeck } from "../api";
import { cardValue } from "../constants/pokerCardValue";

export type Card = {
  image: string;
  value: string;
  suit: string;
  code: string;
};

export type Deck = {
  deckId: string;
  remaining: number;
  lastQueenPosition: number;
  cards: Card[] | [];
  cardsUntilQueen: Card[] | [];
  sortedCards: Card[] | [];
};

export function useDeckOfCards() {
  const [deck, setDeck] = useState<Deck>({
    deckId: "",
    remaining: 0,
    lastQueenPosition: 0,
    sortedCards: [],
    cardsUntilQueen: [],
    cards: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const getLastQueenPosition = useCallback((cards: Card[]) => {
    var queensFound: any = [];

    cards.forEach((card, index) => {
      if (card.value === "QUEEN") {
        queensFound.push(index);
      }
    });

    const lastQueenIndex = queensFound[queensFound.length - 1];
    return lastQueenIndex;
  }, []);

  const sortCards = useCallback((cards: Card[], lastQueenPosition: number) => {
    var sortedCards = [
      ...cards
        .filter((_, index) => index < lastQueenPosition)
        .sort(({ code: firstCardCode }, { code: secondCardCode }) => {
          return (
            cardValue[firstCardCode as any] - cardValue[secondCardCode as any]
          );
        }),
    ];

    return sortedCards;
  }, []);

  const createNewDeck = useCallback(async () => {
    setLoading(true);
    const newDeck = await getDeck();
    const cardsInfo =
      newDeck?.success === true
        ? await getAllCards(newDeck.deck_id)
        : undefined;

    const lastQueenIndex = getLastQueenPosition(cardsInfo.cards);
    const cardsUntilQueen = cardsInfo.cards.filter(
      (_: any, index: number) => index <= lastQueenIndex
    );
    const sortedCards = sortCards(cardsInfo.cards, lastQueenIndex);

    if (newDeck.success === true) {
      setDeck({
        deckId: newDeck.deck_id,
        remaining: newDeck.remaining,
        lastQueenPosition: lastQueenIndex,
        cards: cardsInfo.cards,
        sortedCards: sortedCards,
        cardsUntilQueen,
      });
    }

    if (newDeck.error) {
      setError(newDeck.error);
    }

    setLoading(false);
  }, [getLastQueenPosition, sortCards]);

  useEffect(() => {
    if (deck.deckId.trim().length === 0 && !error) createNewDeck();
  }, [deck.deckId, error, createNewDeck]);

  return {
    createNewDeck,
    loading,
    error,
    deck,
  };
}
