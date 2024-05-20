import ErrorHandeler from "../errors/ErrorHandeling.js";

function apiKeyMiddleWare(req, res, next) {
  const api_key = "123456";
  const userApiKey = req.query.api_key;
  if (userApiKey && userApiKey === api_key) {
    next();
  } else {
    next(ErrorHandeler.forbidden());
  }
}

export default apiKeyMiddleWare;
