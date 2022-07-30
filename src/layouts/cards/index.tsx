import { useCallback, useEffect, useState } from "react";
import { useDeckOfCards } from "../../hooks/useDeckOfCards";
import { CardsBoard } from "./styled";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Grid, Snackbar, Button } from "@mui/material";
import { useInterval } from "../../hooks/useInterval";
import { cardValue } from "../../constants/pokerCardValue";

function Cards() {
  const { deck, error, loading } = useDeckOfCards();
  const { open, openSnackbar, closeSnackbar } = useSnackbar();
  const [count, setCount] = useState(0);
  const [lastQueenIndex, setLastQueenIndex] = useState(0);
  const [intervalActive, setIntervalActive] = useState(false);
  const [sortCards, setSortCards] = useState<any[]>([]);

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

  const handleSort = useCallback(() => {
    var sortedCards = [
      ...deck.cards
        .filter((_, index) => index < lastQueenIndex)
        .sort(({ code: firstCardCode }, { code: secondCardCode }) => {
          return (
            cardValue[firstCardCode as any] - cardValue[secondCardCode as any]
          );
        }),
    ];

    setSortCards(sortedCards);
    console.log(sortedCards);
  }, [deck.cards, lastQueenIndex]);

  useEffect(() => {
    if (error) openSnackbar();
  }, [error, openSnackbar]);

  return (
    <>
      <div style={{ margin: "20px auto 0 auto" }}>
        <Button variant="contained" onClick={onClickButton}>
          Imprimir cartas
        </Button>
        <Button variant="contained" onClick={handleSort}>
          Sort
        </Button>
        {lastQueenIndex}
      </div>
      <CardsBoard>
        {loading && <div>Loading...</div>}

        <Grid container spacing={1} justifyContent="center">
          {deck.cards &&
            deck.cards
              .filter((_, index) => index < count)
              .map(({ image, value, suit }, index) => (
                <Grid item key={index}>
                  <img
                    src={image}
                    style={{ width: "100px", height: "auto" }}
                    alt={`${value}-${suit}-card`}
                    key={index}
                  />
                </Grid>
              ))}
        </Grid>

        {/* <Grid container spacing={1} justifyContent="center">
          {sortCards &&
            sortCards.map(({ image, value, suit }, index) => (
              <Grid item key={index}>
                <img
                  src={image}
                  style={{ width: "100px", height: "auto" }}
                  alt={`${value}-${suit}-card`}
                  key={index}
                />
              </Grid>
            ))}
        </Grid> */}

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
}

export default Cards;
