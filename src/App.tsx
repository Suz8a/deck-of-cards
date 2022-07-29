import "./App.css";
import { CardsProvider } from "./providers/CardProvider";
import { Router } from "./router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <CardsProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </CardsProvider>
  );
}

export default App;
