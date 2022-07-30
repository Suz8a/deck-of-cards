import { useCallback, useEffect, useRef, useState } from "react";
import { useDeckOfCards } from "../../hooks/useDeckOfCards";
import { CardsBoard } from "./styled";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Grid, Snackbar, Button } from "@mui/material";
import { Card } from "../../components/card";
import { Deck } from "../../components/deck";
import CircularProgress from "@mui/material/CircularProgress";

export const Cards = () => {
  const { deck, error, loading } = useDeckOfCards();
  const { open, openSnackbar, closeSnackbar } = useSnackbar();
  const [cardState, setCardState] = useState("");

  const deckRef = useRef(null);
  const deckRef2 = useRef(null);

  const onClickButton = useCallback(async () => {
    setCardState("SHOW");
  }, []);

  useEffect(() => {
    if (deck.lastQueenPosition > 0 && !loading && cardState !== "")
      setTimeout(() => {
        setCardState("HIDDEN");
        setTimeout(() => {
          setCardState("SORT");
        }, (deck.lastQueenPosition + 1) * 100);
      }, (deck.lastQueenPosition + 1) * 1000 + 1000);
  }, [cardState, deck.lastQueenPosition, loading]);

  useEffect(() => {
    if (error) openSnackbar();
  }, [error, openSnackbar]);

  const cards =
    cardState === "SHOW"
      ? deck.cardsUntilQueen
      : cardState === "SORT"
      ? deck.sortedCards
      : [];

  if (loading) return <CircularProgress />;

  return (
    <>
      <CardsBoard>
        <Grid container spacing={2} justifyContent="center">
          <Grid container item justifyContent="center">
            <Grid item>
              <Button
                style={{ width: "200px", height: "50px" }}
                variant="contained"
                onClick={onClickButton}
              >
                Imprimir cartas
              </Button>
            </Grid>
          </Grid>

          <Grid item container>
            <Deck style={{ backgroundColor: "red" }} ref={deckRef} />
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
            <Deck style={{ backgroundColor: "blue" }} ref={deckRef2} />
          </div>

          <Grid container item spacing={2} justifyContent="center">
            {cards &&
              cards.map(({ image, value, suit }, index) => (
                <Grid item key={index}>
                  <Card
                    src={image}
                    alt={`${value}-${suit}-card`}
                    key={index}
                    deckRef={cardState === "SHOW" ? deckRef : deckRef2}
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
