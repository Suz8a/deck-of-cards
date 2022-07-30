import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

export const CardsBoard = styled.div`
  width: 80%;
  min-height: 350px;
  height: auto;
  margin: 50px auto auto auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
  padding: 10px;
`;

export const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  left: 45%;
  top: 45%;
`;
