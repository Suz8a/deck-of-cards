import { useCallback, useEffect, useRef, useState } from "react";
import { useDeckOfCards } from "../../hooks/useDeckOfCards";
import { CardsBoard } from "./styled";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Grid, Snackbar, Button } from "@mui/material";
import { useInterval } from "../../hooks/useInterval";
import { Card } from "../../components/card";
import { Deck } from "../../components/deck";
import CircularProgress from "@mui/material/CircularProgress";

export const Cards = () => {
  const { deck, error, loading } = useDeckOfCards();
  const { open, openSnackbar, closeSnackbar } = useSnackbar();
  const [count, setCount] = useState(0);
  const [lastQueenIndex, setLastQueenIndex] = useState(0);
  const [intervalActive, setIntervalActive] = useState(false);
  const [showSortedCards, setShowSortedCards] = useState<boolean>(false);

  const [cardState, setCardState] = useState("SHOW");

  const deckRef = useRef(null);
  const deckRef2 = useRef(null);

  useInterval(
    () => {
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    intervalActive && count <= lastQueenIndex && count < 52 ? 1000 : null
  );

  const getLastQueenPosition = useCallback(() => {
    var queensFound: any = [];

    deck.cards.forEach((card, index) => {
      if (card.value === "QUEEN") {
        queensFound.push(index);
      }
    });

    const lastQueenIndex = queensFound[queensFound.length - 1];

    return lastQueenIndex;
  }, [deck.cards]);

  const onClickButton = useCallback(async () => {
    setLastQueenIndex(getLastQueenPosition());
    setIntervalActive(true);
  }, [getLastQueenPosition]);

  useEffect(() => {
    if (deck.lastQueenPosition)
      setTimeout(() => {
        setCardState("HIDDEN");
      }, (deck.lastQueenPosition + 1) * 180);
  }, [deck.lastQueenPosition]);

  useEffect(() => {
    if (error) openSnackbar();
  }, [error, openSnackbar]);

  return (
    <>
      {loading && <CircularProgress />}

      <CardsBoard>
        <Grid container spacing={2}>
          <Grid container item spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" onClick={onClickButton}>
                Imprimir cartas
              </Button>
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item>
              <Deck style={{ backgroundColor: "red" }} ref={deckRef} />
            </Grid>
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
            {deck.cards &&
              deck.cards
                .filter((_, index) => index <= deck.lastQueenPosition)
                .map(({ image, value, suit }, index) => (
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
