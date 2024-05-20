import axios from "axios";

export const ApiCall = async (url, method, data) => {
  try {
    const result = await axios(`${url}`, {
      method,
      data,
    });
    const response = await result.data;
    return response;
  } catch (error) {}
};
