const logger = (param) => (store) => (next) => (action) => {
  console.log("logging to", param);
  return next(action);
};

export default logger;
