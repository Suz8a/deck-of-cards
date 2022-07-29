import axios from "axios";
import { Config } from "../config";

export const http = axios.create({ baseURL: Config.apiUrl });

export async function getDeck() {
  const response = await http.get("/new/shuffle/?deck_count=1");
  return response.data;
}

export async function getCard(deckId: string) {
  const response = await http.get(`/${deckId}/draw/?count=1`);
  return response.data;
}
