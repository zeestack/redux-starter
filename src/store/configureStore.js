import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import errorLogger from "./middleware/errorLogger";
import api from "./middleware/api";

const middlewares = [logger("console"), errorLogger, api];

export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
  });
}
