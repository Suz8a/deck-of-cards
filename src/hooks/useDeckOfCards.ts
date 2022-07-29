import { useCallback, useEffect, useState } from "react";
import { getCard, getDeck } from "../api";

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
  const [error, setError] = useState(false);

  const getNewDeck = useCallback(async () => {
    setLoading(true);
    const response = await getDeck();

    if (response.success === true) {
      setDeck({
        deckId: response.deck_id,
        remaining: response.remaining,
        cards: [],
      });
    }

    if (response.success === true) {
      setError(true);
    }

    if (response.success === true) {
      setError(false);
    }

    setLoading(false);
  }, []);

  const getNewCard = useCallback(async () => {
    setLoading(true);
    const response = await getCard(deck.deckId);

    if (response.success === true) {
      const card = response.cards[0];

      setDeck((currentDeck) => ({
        ...currentDeck,
        cards: [...currentDeck.cards, card],
      }));
    }

    if (response.success === true) {
      setError(true);
    }

    if (response.success === true) {
      setError(false);
    }

    setLoading(false);
  }, [deck.deckId]);

  useEffect(() => {
    if (deck.deckId.trim().length === 0 && !error) getNewDeck();
  }, [deck.deckId, error, getNewDeck]);

  return {
    getNewDeck,
    getNewCard,
    loading,
    error,
    deck,
  };
}
