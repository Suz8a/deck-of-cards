import { useCallback, useEffect, useState } from "react";
import { getAllCards, getDeck } from "../api";

export type Card = {
  image: string;
  value: string;
  suit: string;
  code: string;
};

export type Deck = {
  deckId: string;
  remaining: number;
  cards: Card[] | [];
};

export function useDeckOfCards() {
  const [deck, setDeck] = useState<Deck>({
    deckId: "",
    remaining: 0,
    cards: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const createNewDeck = useCallback(async () => {
    setLoading(true);
    const newDeck = await getDeck();
    const cardsInfo =
      newDeck?.success === true
        ? await getAllCards(newDeck.deck_id)
        : undefined;

    if (newDeck.success === true) {
      setDeck({
        deckId: newDeck.deck_id,
        remaining: newDeck.remaining,
        cards: [...cardsInfo.cards],
      });
    }

    if (newDeck.error) {
      setError(newDeck.error);
    }

    setLoading(false);
  }, []);

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
