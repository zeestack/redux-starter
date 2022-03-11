import axios from "axios";
import * as actions from "../api";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onSuccess, onStart, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:9001/api",
        url,
        method,
        data,
      });
      // general actions
      dispatch(actions.apiCallSuccess(response.data));

      // Specific success actions
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      // General error
      dispatch(actions.apiCallFailed(error.message));
      // specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
