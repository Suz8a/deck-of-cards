import { Routes, Route, Navigate } from "react-router-dom";
import { Cards } from "./layouts/cards";

export const Router = () => {
  return (
    <Routes>
      <Route path="/cards" element={<Cards />} />
      <Route path="*" element={<Navigate to="/cards" />} />
    </Routes>
  );
};
