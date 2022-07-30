import { useCallback, useEffect, useRef, useState } from "react";
import { useDeckOfCards } from "../../hooks/useDeckOfCards";
import { CardsBoard, StyledCircularProgress } from "./styled";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Grid, Snackbar, Button } from "@mui/material";
import { Card } from "../../components/card";
import { Deck } from "../../components/deck";
import BackOfCard from "../../assets/back-of-card.jpeg";

export const Cards = () => {
  const { deck, error, loading, createNewDeck } = useDeckOfCards();
  const { open, openSnackbar, closeSnackbar } = useSnackbar();
  const [cardState, setCardState] = useState("");
  const [showButtonIsDisabled, setShowButtonIsDisabled] = useState(false);
  const mainDeck = useRef(null);
  const centeredDeck = useRef(null);

  const onShowCards = useCallback(async () => {
    setShowButtonIsDisabled(true);
    setCardState("SHOW");
    setTimeout(() => {
      setCardState("HIDDEN");
      setTimeout(() => {
        setCardState("SORT");
      }, (deck.lastQueenPosition + 1) * 100);
    }, (deck.lastQueenPosition + 1) * 1000 + 1000);
  }, [deck.lastQueenPosition]);

  const onCreateNewDeck = useCallback(() => {
    setCardState("");
    createNewDeck();
    setShowButtonIsDisabled(false);
  }, [createNewDeck]);

  useEffect(() => {
    if (error) openSnackbar();
  }, [error, openSnackbar]);

  const cards =
    cardState === "SHOW" || cardState === "HIDDEN"
      ? deck.cardsUntilQueen
      : cardState === "SORT"
      ? deck.sortedCards
      : [];

  if (loading) {
    return <StyledCircularProgress size="150px" />;
  }

  return (
    <>
      <CardsBoard>
        <Grid container spacing={2} justifyContent="center">
          <Grid container item spacing={2} justifyContent="center">
            <Grid item>
              <Button
                style={{ width: "200px", height: "50px" }}
                disabled={showButtonIsDisabled}
                variant="contained"
                onClick={onShowCards}
              >
                Show cards
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{ width: "200px", height: "50px" }}
                variant="outlined"
                onClick={onCreateNewDeck}
              >
                New Deck
              </Button>
            </Grid>
          </Grid>

          <Grid item container>
            <Deck
              style={{
                backgroundColor: "gray",
                backgroundImage: `url(${BackOfCard})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                border: "1px solid #808080",
                borderRadius: "5px",
              }}
              ref={mainDeck}
            />
          </Grid>

          <div
            style={{
              width: "100px",
              height: "134px",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Deck ref={centeredDeck} />
          </div>

          <Grid container item spacing={2} justifyContent="center">
            {cards &&
              cards.map(({ image, value, suit }, index) => (
                <Grid item key={index}>
                  <Card
                    src={image}
                    alt={`${value}-${suit}-card`}
                    key={index}
                    deckRef={cardState === "SHOW" ? mainDeck : centeredDeck}
                    index={index}
                    cardState={cardState}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>

        {error && (
          <Snackbar
            open={open}
            onClose={closeSnackbar}
            autoHideDuration={15000}
          >
            <Alert severity="error" onClose={closeSnackbar}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </CardsBoard>
    </>
  );
};
